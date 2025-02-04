import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";
//import { game } from "../main";

const grasshopperDefault = new ex.Sprite({
  image: Images.Grasshopper,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

//demonic version for nightmare difficulty (still in progress)
const grasshopperDDefault = new ex.Sprite({
  image: Images.GrasshopperD,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const grasshopperIdleSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.GrasshopperIdle,
  grid: {
    rows: 1,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const grasshopperJumpSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Grasshopper,
  grid: {
    rows: 3,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const grasshopperJumpDSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.GrasshopperD,
  grid: {
    rows: 3,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 100;
const animsp2 = 200;

export class Grasshopper extends Enemy {
  constructor(level?: number) {
    super({
      scale: ex.vec(0.5, 0.5),
    });
    //default stats
    this.hp = 100;
    this.def = 10;
    this.attack = 10;
    this.def_magic = 20;
    this.magic = 10;
    this.xp = 50;
    this.skills = ["jump"];
    this.elemental_res = {
      fire: 75,
      water: -90,
      ice: 25,
      wind: -50,
    };
    if (level != undefined) {
      this.level = level;
    }
  }

  onInitialize() {
    var idleAnim = ex.Animation.fromSpriteSheet(
      grasshopperIdleSpriteSheet,
      ex.range(0, 3),
      animsp2,
      ex.AnimationStrategy.Loop
    );
    this.leveledStats(this.level);
    if (!this.demonic) {
      this.graphics.add(idleAnim);
    } else {
      this.graphics.add(grasshopperDDefault);
    }
  }

  public jump() {
    var jumpAnim = ex.Animation.fromSpriteSheet(
      grasshopperJumpSpriteSheet,
      ex.range(0, 11),
      animsp,
      ex.AnimationStrategy.End
    );
    if (this.demonic) {
      jumpAnim = ex.Animation.fromSpriteSheet(
        grasshopperJumpDSpriteSheet,
        ex.range(0, 11),
        animsp,
        ex.AnimationStrategy.End
      );
    }

    //grasshopper jumps to a player
    const Stops = 4; //how many times it should rotate a bit while jumping till player
    const heropos = 317; //temporary constant
    this.actions.callMethod(() => {
      this.graphics.use(jumpAnim).reset();
    });
    this.actions.easeTo(ex.vec(785, this.pos.y - 20.5), (animsp * 11) / Stops);
    //this.actions.rotateBy(Math.PI / 4, 100);
    this.actions.easeTo(ex.vec(597, this.pos.y - 41), (animsp * 11) / Stops);
    //this.actions.rotateBy(-Math.PI / 4, 100);
    this.actions.easeTo(ex.vec(409, heropos - 20.5), (animsp * 11) / Stops);
    this.actions.rotateBy(Math.PI / 4, 100);
    this.actions.easeTo(ex.vec(221, heropos), (animsp * 11) / Stops);
    this.actions.callMethod(() => {
      if (!this.demonic) {
        this.graphics.use(grasshopperDefault);
      } else {
        this.graphics.use(grasshopperDDefault);
      }
    });
    this.actions.delay(200);
    /*
    jump back
    */
    this.actions.callMethod(() => {
      this.graphics.use(jumpAnim).reset();
    });
    //damage is dealt the moment grasshopper jumps back
    this.actions.callMethod(() => {
      this.dealDamage(60, false, "fire", 1);
    });
    this.actions.rotateBy(Math.PI / 4, 100);
    this.actions.easeTo(ex.vec(409, heropos - 20.5), (animsp * 11) / Stops);
    this.actions.rotateBy(Math.PI / 2, 100);
    this.actions.easeTo(ex.vec(597, this.pos.y - 41), (animsp * 11) / Stops);
    this.actions.rotateBy(Math.PI / 4, 100);
    this.actions.easeTo(ex.vec(785, this.pos.y - 20.5), (animsp * 11) / Stops);
    this.actions.rotateBy(Math.PI / 2, 100);

    this.actions.callMethod(() => {
      if (!this.demonic) {
        this.graphics.use(grasshopperDefault);
      } else {
        this.graphics.use(grasshopperDDefault);
      }
    });
    this.actions.easeTo(ex.vec(this.pos.x, this.pos.y), (animsp * 11) / Stops);
    this.actions.rotateBy(Math.PI / 4, 32);
    this.actions.delay(50);
    //if it is a nightmare difficulty each skill has a chance to be used multiple times in a turn (the chance depends on the skill used)
    if (this.demonic) {
      this.actions.callMethod(() => {
        if (Math.round(Math.random() * 100) < 50) {
          //it will most probably not be 50% in the game, that is mainly meant for testing purposes
          var text = new ex.Text({
            text: "Cursed: +1 Turn",
            font: new ex.Font({ size: 75 }),
            color: ex.Color.Red,
          });
          let texty = new ex.Actor();
          this.addChild(texty);
          texty.graphics.use(text);
          texty.actions.easeBy(
            //flies up diagonaly a random distance ranging 50 to 150 pixels
            ex.vec(
              -Math.round(Math.random() * 100) + 50,
              -Math.round(Math.random() * 100) + 50
            ),
            400
          );
          //and then fades
          texty.actions.fade(0, 600);
          texty.actions.die();
          this.actions.delay(1000);
          this.useSkill();
        }
      });
    }
  }

  public update(engine: ex.Engine, delta: number) {
    if (this.hp <= 0) {
      this.die();
    }

    if (this.dmg.target == this.target) {
      //console.log("target aquired: " + this.dmg.target);
      this.takeDamage(this.dmg.amount, this.dmg.magic, this.dmg.element);
      this.dmg.target = 0;
    }

    //temporary to test animations
    if (engine.input.keyboard.wasReleased(ex.Keys.E)) {
      this.jump();
    }

    super.update(engine, delta);
  }

  public useSkill(): void {
    this.jump();
    var idleAnim = ex.Animation.fromSpriteSheet(
      grasshopperIdleSpriteSheet,
      ex.range(0, 3),
      animsp2,
      ex.AnimationStrategy.Loop
    );
    //sets the grasshopper back to idle animation after using a skill
    this.actions.callMethod(() => {
      this.actions.callMethod(() => {
        if (!this.demonic) {
          this.graphics.use(idleAnim);
        } else {
          this.graphics.use(grasshopperDDefault);
        }
      });
    });
  }
}
