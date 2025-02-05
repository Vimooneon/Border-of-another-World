import * as ex from "excalibur";
import { Button } from "../actors/buttons/button_abstract";
import { Images } from "../resources";
import { Description } from "../actors/description";
import { writable } from "../actors/writer";

export class achievement {
  public name: string;
  public tier: number; //4 tiers: 1. bronze, 2. silver, 3. gold, 4. diamond
  public image: ex.Sprite;
  public acquired: boolean = false;
  public description: string;
  public hint: string;
  constructor(
    name: string,
    tier: number,
    image: ex.Sprite,
    description: string,
    hint: string
  ) {
    this.name = name;
    this.tier = tier;
    this.image = image;
    this.description = description;
    this.hint = hint;
  }
}

const bronze = new ex.Sprite({ image: Images.MedalBronze });
const silver = new ex.Sprite({ image: Images.MedalSilver });
const gold = new ex.Sprite({ image: Images.MedalGold });
const diamond = new ex.Sprite({ image: Images.MedalDiamond });

export class Achievements extends ex.Scene {
  public achievemnt_list: achievement[] = [];

  public getAchievement(achv: string, scene: ex.Scene) {
    for (let i = 0; i < this.achievemnt_list.length; i++) {
      if (this.achievemnt_list[i].name == achv) {
        //checks if achievement already was acquired
        if (!this.achievemnt_list[i].acquired) {
          this.achievemnt_list[i].acquired = true;
          let wr = new writable();
          wr.anchor = ex.vec(1, 0);
          wr.pos = ex.vec(1184, 50); //top right corner
          scene.add(wr);
          wr.Write("New achievement unlocked: " + achv, 40, 50);
          wr.actions.delay(2000); //output time +2 seconds for player to read the achievement
          wr.actions.fade(0, 200);
          wr.actions.die();
          return;
        }
      }
    }
  }

  public hasAchievement(achv: string){
    for (let i = 0; i < this.achievemnt_list.length; i++) {
      if (this.achievemnt_list[i].name == achv) {
        //checks if achievement already was acquired
        if (this.achievemnt_list[i].acquired) {
          return true;
        }else{
          return false;
        }
      }
    }
    return false;
  }

  //Initializes all achievements
  public Init() {
    this.achievemnt_list.push(
      new achievement(
        "Leg day",
        1,
        new ex.Sprite({ image: Images.MedalLegDay }),
        "Leg day!\n Wow you really ran away there!",
        "Leg day?\n Make the run away button useful for once!"
      )
    );
    this.achievemnt_list.push(
      new achievement(
        "Super effective",
        1,
        new ex.Sprite({ image: Images.MedalBronze }),
        "Super effective!\n Wait... what do you mean it's the opposite of that?",
        "Super effective?\n Try the weakest spot (wait no, the strongest one!)"
      )
    );

    this.achievemnt_list.push(
      new achievement(
        "Pest control",
        2,
        new ex.Sprite({ image: Images.MedalPest }),
        "Pest control.\n No more bugs!",
        "Pest control?\n Defeat the bee and beecome the beeautiful completionist for the I chapter."
      )
    );
    this.achievemnt_list.push(
      new achievement(
        "Wall-hugger",
        2,
        new ex.Sprite({ image: Images.MedalSilver }),
        "Wall-hugger.\n Would be nice if walls hugged you back, right?",
        "Wall-hugger.\n Go through some specific walls that lead to a secret room with a chest\n (can only see the pathway when right next to the 'wall')"
      )
    );
    //Delayed... for chapter 3?
    this.achievemnt_list.push(
      new achievement(
        "Social!",
        2,
        new ex.Sprite({ image: Images.MedalSilver }),
        "Social!\n Oh so you are an extrovert to such degree",
        "Social!\n Try talking ig \n(Yep just talk to every NPC in the game)"
      )
    );

    this.achievemnt_list.push(
      new achievement(
        "Eye contact",
        3,
        new ex.Sprite({ image: Images.MedalEye }),
        "Eye contact.\n He's just standning there... Menacingly!",
        "Eye contact?\n Stare at the enemy... for a long time!"
      )
    );
    this.achievemnt_list.push(
      new achievement(
        "Ice-cold",
        3,
        new ex.Sprite({ image: Images.MedalIce }),
        "Ice-cold.\n That spider really needed to 'cool down'.",
        "Ice-cold?\n Defeat the secret ice spider boss\n that's it, no more clues."
      )
    );
    //Pacifism is currently unachievable, but eventually will be
    this.achievemnt_list.push(
      new achievement(
        "Pacifism",
        4,
        new ex.Sprite({ image: Images.MedalLegDay }),
        "Pacifism.\n No need to fight.",
        "Pacifism?\n Win without fighting."
      )
    );
    /*
    //solely for testing purposes:
    this.achievemnt_list.push(
      new achievement(
        "Unachievable",
        4,
        new ex.Sprite({ image: Images.MedalDiamond }),
        "Unachievable!\n Ehmm... How did you get it?",
        "Unachievable?\n Ignore this."
      )
    );
    */
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {
    var description = new Description(1500, 1500, 1, 30); //1 description actor with changing text for all achievements, (1500, 1500) = out of sight
    this.add(description);
    for (let i = 0; i < this.achievemnt_list.length; i++) {
      const achv = new ex.Actor({
        width: 376,
        height: 376,
        scale: ex.vec(0.25, 0.25),
      });
      achv.pos.x = 94 + 94 * i; //94 is actual width of achievement after scaling
      achv.pos.y = 94;
      if (this.achievemnt_list[i].acquired) {
        achv.graphics.use(this.achievemnt_list[i].image);
        achv.on("pointerenter", () => {
          //updates description actor's text on entering the unlocked achievement
          description.updateText(this.achievemnt_list[i].description);
        });
        achv.on("pointermove", (evt) => {
          //description actor follows the mouse
          description.pos = evt.screenPos;
        });
        achv.on("pointerleave", () => {
          //removes text and teleports the actor out of sight
          description.updateText("");
          description.pos = ex.vec(1500, 1500);
        });
      } else {
        switch (
          this.achievemnt_list[i].tier //tiers of unlockable achievement
        ) {
          case 1:
            achv.graphics.use(bronze);
            break;
          case 2:
            achv.graphics.use(silver);
            break;
          case 3:
            achv.graphics.use(gold);
            break;
          case 4:
            achv.graphics.use(diamond);
            break;
        }
      }
      this.add(achv);
    }
    if ((_context.data as number) == 2) {
      //in case medals were opened from the in game world
      const back = new Button(597, 834 - 60, true, 0.5, 60, "Back", () => {
        _context.engine.goToScene("world");
        this.clear();
      });
      this.add(back);
    } else {
      //in case medals were opened from the main menu
      const back = new Button(597, 834 - 60, true, 0.5, 60, "Back", () => {
        _context.engine.goToScene("menu");
        this.clear();
      });
      this.add(back);
    }
  }
}
