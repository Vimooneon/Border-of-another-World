import * as ex from "excalibur";
import { damage } from "./damage";
import { InfoBox } from "./description";
import { Equipment } from "./equipment_abstract";
import { Images } from "../resources";
import { Achievements } from "../scenes/achievements";

const infoDefault = new ex.Sprite({
  image: Images.Info,
});

export class Enemy extends ex.Actor {
  public target = 0; //gives a target number for the enemy so it could be attacked
  public hp = 0; //health points of the enemy
  public def = 0; //physical defense of the enemy
  public def_magic = 0; //magic defense of the enemy
  public attack = 0; //physical power of the enemy
  public magic = 0; //magic power of the enemy
  public xp = 0; //how much experience will player get for defeating the foe
  public demonic: boolean = false; //whether the enemy should be demonic version, it impacts the leveledStats function
  public skills: string[] = []; //array of possible enemy skills(different attacks, e.g. jump for grasshopper), only will be used for enemies with multiple attacks (e.g. bee: 1=honey_shield, 2=piercing_attack)
  public elemental_res: { [key: string]: number } = {}; //list of elemental resistances, current elements:wind, water, fire, ice
  public level: number = 1; //level of the enemy
  public dmg: damage = new damage(); //variable that is sent further to actualy deal damage, and gets sent here when recieving damage
  public buffs: { [key: string]: number } = {
    //map of the current buffs applied to the enemy
    attack: 0,
    magic: 0,
    def: 0,
    defM: 0,
  };

  //scales normal stats to the given level
  public leveledStats(level: number) {
    level--;
    if (this.demonic) {
      level * 2;
    }
    this.hp += (this.hp * level) / 5;
    this.def += (this.def * level) / 5;
    this.def_magic += (this.def_magic * level) / 5;
    this.attack += (this.attack * level) / 5;
    this.magic += (this.magic * level) / 5;
    return 0;
  }

  public equipStats(equip: Equipment) {
    this.hp += equip.hp;
    this.def += equip.def;
    this.def_magic += equip.def_magic;
    this.attack += equip.attack;
    this.magic += equip.magic;
    for (let i in equip.elemental_res) {
      if (isNaN(this.elemental_res[i])) {
        this.elemental_res[i] = equip.elemental_res[i];
      } else {
        this.elemental_res[i] += equip.elemental_res[i];
      }
    }
  }

  //is called to count total damage enemy would deal
  //in short:skill_power*attack_stat
  public dealDamage(power: number, magic: boolean, el: string, target: number) {
    if (magic) {
      this.dmg.amount =
        power * (this.magic + (this.magic * this.buffs["magic"]) / 100);
      this.dmg.magic = true;
    } else {
      this.dmg.amount =
        power * (this.attack + (this.attack * this.buffs["attack"]) / 100);
      this.dmg.magic = false;
    }
    this.dmg.element = el;
    this.dmg.target = target;
  }

  //is called to count total damage enemy would recieve
  //in short:(total_damage-elemental_resistance)/defense
  public takeDamage(dmg: number, magic: boolean, el: string) {
    /* ---------------- achievement code ---------------- */
    if (this.target != 1) {
      //if the enemy is not the player
      let max = 0; //maximal resistance out of all elements
      for (let i in this.elemental_res) {
        if (this.elemental_res[i] > max) {
          max = this.elemental_res[i];
        }
      }
      if (this.elemental_res[el] == max) {
        let achv = this.scene.engine.scenes["achievements"] as Achievements;
        achv.getAchievement("Super effective", this.scene);
      }
    }
    /* ---------------- ---------------- ---------------- */

    //if elements does not exist in the resistance table => assume resistance is 0%
    if (!this.elemental_res[el] == undefined) {
      dmg -= (dmg * this.elemental_res[el]) / 100;
    }
    if (magic) {
      dmg =
        dmg / (this.def_magic + (this.def_magic * this.buffs["defM"]) / 100);
    } else {
      dmg = dmg / (this.def + (this.def * this.buffs["def"]) / 100);
    }
    //random +/-5% damage, damage + randomizer = damagerizer
    let damagerizer = Math.round(Math.random() * 10) - 5;

    var text = new ex.Text({
      text: "",
      font: new ex.Font({ size: 60 + damagerizer * 2 }), //more damage => BIGGER FONT
      color: ex.Color.White,
    });

    let texty = new ex.Actor();
    texty.z = 99;
    //crit has 15% chance, crit = x2 damage
    if (Math.round(Math.random() * 100) < 15) {
      damagerizer = 100;
      texty.scale = ex.vec(1.5, 1.5);
      text.font.height *= 1.5;
      text.color = ex.Color.Red;
    }
    //add bonus damage and round the number (to not see things like 22.5 damage)
    dmg = Math.round(dmg + (dmg * damagerizer) / 100);
    text.text = dmg.toString();
    //text which shows the damage dealt

    this.addChild(texty);
    texty.graphics.use(text);
    texty.actions.easeBy(
      //flies up diagonaly a random distance 25-75 pixels
      ex.vec(
        Math.round(Math.random() * 50) + 25,
        -Math.round(Math.random() * 50) + 25
      ),
      200
    );
    //and then fades
    texty.actions.fade(0, 600);
    texty.actions.callMethod(() => {
      texty.unparent();
    });
    this.hp -= dmg;
  }

  //is called when hp<=0
  public die() {
    this.actions.fade(0, 600);
    this.actions.die();
  }

  //called at the end of each turn, decreases existing buffs
  public decreaseBuffs() {
    if (this.buffs["attack"] > 0) {
      this.buffs["attack"] -= 5;
    }
    if (this.buffs["magic"] > 0) {
      this.buffs["magic"] -= 5;
    }
    if (this.buffs["def"] > 0) {
      this.buffs["def"] -= 5;
    }
    if (this.buffs["defM"] > 0) {
      this.buffs["defM"] -= 5;
    }
  }

  //abstract method that will use defined skills for each enemy
  public useSkill() {}

  //used at the start of the battle and each time it's heroes turn
  //adds question mark, when mouse hovers => give info about enemy: HP, level and elemental resistance
  public addInfo() {
    let info = new ex.Actor({
      width: 376,
      height: 376,
      name: "info",
      scale: ex.vec(0.125 / this.scale.x, 0.125 / this.scale.y), //the size of the enemy should not impact the size of question mark
      z: 2,
    });
    var infoBox = new InfoBox(0, 0, 0.5 / this.scale.x, this.elemental_res); //neither should the size of the enemy impact box size
    infoBox.graphics.visible = false; //is invisible until mouse hovers above the question mark
    info.graphics.use(infoDefault); //infoDefault = question mark texture
    info.on("pointerenter", () => {
      //shows the box and updates it's content
      infoBox.updateText(
        "♡: " + this.hp.toString() + " \n" + "Level:" + this.level.toString()
      );
      infoBox.graphics.visible = true;
    });
    info.on("pointerleave", () => {
      //hides the box
      infoBox.graphics.visible = false;
    });
    this.addChild(info);
    this.addChild(infoBox);
  }

  //used at the start of enemy turn
  //removes the question mark and the box assigned to it
  public removeInfo() {
    let entityRemoveArr: ex.Entity[] = [];
    for (let i = 0; i < this.children.length; i++) {
      if (
        this.children[i].name == "info" ||
        this.children[i].name == "infobox"
      ) {
        entityRemoveArr.push(this.children[i]);
      }
    }
    if (entityRemoveArr.length > 1) {
      entityRemoveArr[1].unparent();
      entityRemoveArr[0].unparent();
    }
  }
}
