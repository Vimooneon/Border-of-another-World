import * as ex from "excalibur";
import * as background from "../actors/background";
import { PlayerInBattle } from "../actors/hero";
import { Button } from "../actors/buttons/button_abstract";
import { Enemy } from "../actors/enemy_abstract";
import { Target } from "../actors/buttons/button_target";
import { Achievements } from "./achievements";
import { Skill } from "../actors/skills/skills";
import { writable } from "../actors/writer";
import { Sounds } from "../resources";

export class BattleScene extends ex.Scene {
  public heroArray: PlayerInBattle[] = [];
  public enemyArray: Enemy[] = [];
  public turn: number = 0;
  public buttons: Button[] = [];
  public tactics_buttons: Button[] = [];
  public skill_buttons: Button[] = [];
  public enemyCounter = 0;
  public location: number = 1; //the current location => what background to use for the battle
  public bgArray: ex.Actor[] = [];
  //timer for a certain achievement
  public stare: ex.Timer = new ex.Timer({
    interval: 120000,
    fcn: () => {
      let achv = this.engine.scenes["achievements"] as Achievements;
      achv.getAchievement("Eye contact", this);
    },
  });
  //task is method that is used by target buttons, default:just comment the chosen enemy number and it's position (the code may change)
  public task: (target: number, pos: number) => any = (target, pos) => {
    console.log(target, pos);
  };

  public onPostUpdate(_engine: ex.Engine, _delta: number): void {
    if (this.turn == 1) {
      //player turn start, buttons appear (if player died on this turn he is sent to lost screen)
      this.stare.start(); //certain achievement timer
      if (this.heroArray[0].hp <= 0) {
        this.exitBattle(1);
        return;
      }
      for (let i = 0; i < this.enemyArray.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          break;
        }
        if (i == this.enemyArray.length - 1) {
          //checks if all enemies died
          this.turn = 3;
          return;
        }
      }
      this.showButtons();
      this.turn = 0;
    }
    if (this.turn == 1.5) {
      //not really a turn, rather some processing done between turn 1 and 2: stoping the achievement timer and hiding all current buttons
      this.stare.stop();
      this.hideButtons();
      this.turn = 2;
    }
    if (this.turn == 2) {
      //turn 2 - enemy turn; each alive enemy uses a skill
      if (this.heroArray[0].actions.getQueue().isComplete()) {
        let target = 1;
        if (this.heroArray[0].hasStatusEffect("wind_shield")) {
          this.enemyArray.forEach((e, i, _) => {if (!e.isKilled() && i!=0){target=4+i}})
        }
        if (!this.enemyArray[0].isKilled()) {
          this.enemyArray[0].useSkill(target);
          this.enemyArray[0].actions.callMethod(()=>{this.heroArray[0].decreaseStatusEffect("wind_shield");})
        }
        this.turn = 2.5;
      }
    }
    if (this.turn == 2.5) {
      //continues turn 2 before returning to turn 1

      //checks if current enemy attack ended
      if (this.enemyArray[this.enemyCounter].actions.getQueue().isComplete()) {
        if (
          //if there are more enemies left and player is still alive
          this.enemyCounter < this.enemyArray.length - 1 &&
          this.heroArray[0].hp > 0
        ) {
          //next alive enemy uses it's attack
          this.enemyCounter++;
          if (!this.enemyArray[this.enemyCounter].isKilled()) {
            let target = 1;
            if (this.heroArray[0].hasStatusEffect("wind_shield")) {
              this.enemyArray.forEach((e, i, _) => {if (!e.isKilled() && i!=this.enemyCounter){target=4+i}})
            }
            if (!this.enemyArray[0].isKilled()) {
              this.enemyArray[this.enemyCounter].useSkill(target);
              this.enemyArray[this.enemyCounter].actions.callMethod(()=>{this.heroArray[0].decreaseStatusEffect("wind_shield");})
            }
          }
        } else {
          //at the end of the turn decrease all buffs and return to turn 1
          this.heroArray[0].decreaseBuffs();

          for (let i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].decreaseBuffs();
          }
          this.enemyCounter = 0;
          this.turn = 1;
        }
      }
    }
    if (this.turn == 3) {
      //turn 3 - end of the battle
      this.turn = -1; // a non existant turn so no processes will happen
      let wr = new writable();
      wr.pos = ex.vec(600, 317);
      this.add(wr);
      //wr.Write("EXP: " + this.heroArray[0].xp.toString(), 40, 50); //Xp before battle
      for (let i = 0; i < this.enemyArray.length; i++) {
        //adds exp gained for each enemy
        this.heroArray[0].xp += this.enemyArray[i].xp;
      }
      wr.Write("EXP: " + this.heroArray[0].xp.toString(), 40, 50, true);
      wr.actions.delay(this.heroArray[0].xp.toString().length * 50 + 200); //previous text typing time +200 miliseconds
      wr.actions.callMethod(() => {
        if (this.heroArray[0].xp >= 100 * this.heroArray[0].level) {
          //plaeyr has a new level?
          for (; this.heroArray[0].xp >= 100 * this.heroArray[0].level; ) {
            //adds new levels from gained exp, level requirement: (100*current level) of experience
            this.heroArray[0].xp -= 100 * this.heroArray[0].level;
            this.heroArray[0].level++;
          }
          wr.currentText = "";
          wr.updateText();
          wr.Write("EXP: " + this.heroArray[0].xp.toString(), 40, 50, true); //updates the gained exp count after subtracting amount used for new levels
          let wr2 = new writable();
          wr2.pos = ex.vec(600, 367);
          this.add(wr2);
          wr2.Write(
            "New level: " + this.heroArray[0].level.toString(),
            40,
            50,
            true
          );
        }
      });

      //returns player to the world with code 2(=victory)
      var cont = new Button(600, 417, true, 0.5, 60, "Continue", () => {
        this.exitBattle(2);
      });
      this.add(cont);
    }
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {
    this.Background(this.location); //different locations -> different background

    //adds all players and enemies to the battle scene
    let heroAndEnemyArray: Enemy[] = _context.data as Enemy[];
    this.add(heroAndEnemyArray[0] as PlayerInBattle);
    this.heroArray.push(heroAndEnemyArray[0] as PlayerInBattle);

    for (let i = 1; i < heroAndEnemyArray.length; i++) {
      this.add(heroAndEnemyArray[i]);
      this.enemyArray.push(heroAndEnemyArray[i]);
    }
    this.addInfo(); //adds infoBox for each battle participant
    this.Buttons(); //adds buttons to the scene

    this.add(this.stare); //achievement timer
    this.stare.start();
  }

  public addInfo() {
    for (let i = 0; i < this.heroArray.length; i++) {
      if (!this.heroArray[i].isKilled()) {
        this.heroArray[i].addInfo();
      }
    }
    for (let i = 0; i < this.enemyArray.length; i++) {
      if (!this.enemyArray[i].isKilled()) {
        this.enemyArray[i].addInfo();
      }
    }
  }

  public removeInfo() {
    for (let i = 0; i < this.enemyArray.length; i++) {
      if (!this.enemyArray[i].isKilled()) {
        this.enemyArray[i].removeInfo();
      }
    }
    for (let i = 0; i < this.heroArray.length; i++) {
      if (!this.heroArray[i].isKilled()) {
        this.heroArray[i].removeInfo();
      }
    }
  }

  public Background(world: number) {
    //      backgrounds
    if (world == 1) {
      // Plains -> done
      const plains = new background.Plains();
      this.add(plains);
      const clouds1 = new background.Clouds(-1194, 0);
      const clouds2 = new background.Clouds(0, 0);
      this.add(clouds1);
      this.add(clouds2);
      this.bgArray.push(plains);
      this.bgArray.push(clouds1);
      this.bgArray.push(clouds2);
    }
    // Lab -> make
    if (world == 2) {
      const wr = new writable();
      wr.currentText = "Lab info: This background does not yet exist";
      wr.updateText();
      wr.pos = ex.vec(517, 400);
      this.add(wr);
      this.bgArray.push(wr);
    }
    // Pyramid -> separate layers
    if (world == 3) {
      const pyramid = new background.Pyramid();
      this.add(pyramid);
      this.bgArray.push(pyramid);
    }
    // GhostTown -> done (separate layers?)
    if (world == 4) {
      const town = new background.GhostTown();
      this.add(town);
      this.bgArray.push(town);
    }
    // BlackHole -> done
    if (world == 5) {
      const galaxy = new background.BlackHole();
      this.add(galaxy);
      this.bgArray.push(galaxy);
    }
    // Forest -> done
    if (world == 6) {
      const forest = new background.Forest();
      this.add(forest);
      this.bgArray.push(forest);
    }
    //  ----------
  }

  //Adds buttons to the battle scene
  public Buttons() {
    var targets: Target[] = this.TargetButtons();

    //      buttons

    //cancels current attack/skill => removes "target buttons" and brings back all other buttons
    const cancel = new Button(370, 417, true, 0.5, 60, "Cancel", () => {
      cancel.pos.x += 1500;
      for (let i = 0; i < targets.length; i++) {
        targets[i].pos.x += 1500;
      }
      this.showButtons();
    });
    this.add(cancel);
    cancel.pos.x += 1500;

    //regular attack
    const attack = new Button(370, 417, true, 0.5, 60, "Attack", () => {
      for (let i = 0; i < targets.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          targets[i].pos.x -= 1500;
        }
      }
      this.task = (target, pos) => {
        cancel.pos.x += 1500;
        this.heroArray[0].basicAttack(target, pos);
      };
      this.hideButtons();
      cancel.pos.x -= 1500;
    });
    this.add(attack);
    this.buttons.push(attack);

    /* ------------- tactics block ------------- */
    const block = new Button(370 + 188, 467, true, 0.5, 60, "Block", () => {
      //currently: gives player 50% buff of both: def and defM
      this.heroArray[0].block();
      this.turn = 1.5;
    });
    this.add(block);
    this.tactics_buttons.push(block);

    //makes the player leave the battle with code 0(=run away)
    const run_away = new Button(
      370 + 188,
      517,
      true,
      0.5,
      45,
      "Run away",
      () => {
        this.exitBattle(0);
        return;
      }
    );
    this.add(run_away);
    this.tactics_buttons.push(run_away);

    /* ------------- ------------- -------------*/
    for (let i = 0; i < this.tactics_buttons.length; i++) {
      //hides all the buttons in tactic block
      this.tactics_buttons[i].pos.x += 1500;
    }
    const tactics = new Button(370, 467, false, 0.5, 60, "Tactics", () => {
      //shows all the buttons in the block if hidden and hides if shown
      if (this.tactics_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.tactics_buttons.length; i++) {
          this.tactics_buttons[i].pos.x += 1500;
        }
      } else {
        for (let i = 0; i < this.tactics_buttons.length; i++) {
          this.tactics_buttons[i].pos.x -= 1500;
        }
      }
      //also hides all the skill buttons if they are shown; so that buttons won't overlap
      if (this.skill_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.skill_buttons.length; i++) {
          this.skill_buttons[i].pos.x += 1500;
        }
      }
    });
    this.add(tactics);
    this.buttons.push(tactics);
    /* ------------- ------------- -------------*/

    /* ------------- skills block -------------*/
    const snowcloud = new Button(370 + 188, 467, true, 0.5, 60, "Snow", () => {
      for (let i = 0; i < targets.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          targets[i].pos.x -= 1500;
        }
      }
      this.task = (target, pos) => {
        cancel.pos.x += 1500;
        let sn = new Skill();
        this.add(sn);
        let time = sn.snowFlake(
          this.heroArray[0].magic,
          this.heroArray[0].buffs,
          target,
          ex.vec(973, pos),
          this.heroArray[0].dmg
        );
        this.heroArray[0].actions.delay(time + 50);
        //target, pos;
      };
      this.hideButtons();
      cancel.pos.x -= 1500;
    });
    this.add(snowcloud);
    this.skill_buttons.push(snowcloud);

    const fire = new Button(370 + 188, 517, true, 0.5, 60, "Fire", () => {
      for (let i = 0; i < targets.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          targets[i].pos.x -= 1500;
        }
      }
      this.task = (target, pos) => {
        cancel.pos.x += 1500;
        let sn = new Skill();
        this.add(sn);
        let time = sn.fire(
          this.heroArray[0].magic,
          this.heroArray[0].buffs,
          target,
          ex.vec(973, pos),
          this.heroArray[0].dmg
        );
        this.heroArray[0].actions.delay(time + 50);
        //target, pos;
      };
      this.hideButtons();
      cancel.pos.x -= 1500;
    });
    this.add(fire);
    this.skill_buttons.push(fire);

    const lightning = new Button(370 + 188, 567, true, 0.5, 60, "lightning", () => {
      for (let i = 0; i < targets.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          targets[i].pos.x -= 1500;
        }
      }
      this.task = (target, pos) => {
        cancel.pos.x += 1500;
        let sn = new Skill();
        this.add(sn);
        let time = sn.lightning(
          this.heroArray[0].magic,
          this.heroArray[0].buffs,
          target,
          ex.vec(973, pos),
          this.heroArray[0].dmg
        );
        this.heroArray[0].actions.delay(time + 50);
        //target, pos;
      };
      this.hideButtons();
      cancel.pos.x -= 1500;
    });
    this.add(lightning);
    this.skill_buttons.push(lightning);

    const storm = new Button(370 + 188, 667, true, 0.5, 60, "storm", () => {
      for (let i = 0; i < this.enemyArray.length; i++) {
      this.heroArray[0].actions.callMethod(()=>{
        if (!this.enemyArray[i].isKilled()) {
          let sn = new Skill();
        this.add(sn);
        let time = sn.lightning(
          this.heroArray[0].magic,
          this.heroArray[0].buffs,
          4+i,
          ex.vec(973, this.enemyArray[i].pos.y),
          this.heroArray[0].dmg
        );
        this.heroArray[0].actions.delay(time/this.enemyArray.length + 50);
        }
      })
      }
      this.turn = 1.5;
    });
    this.add(storm);
    this.skill_buttons.push(storm);

    const wind = new Button(370 + 188, 617, true, 0.5, 60, "wind", () => {
      this.heroArray[0].addStatusEffect("wind_shield");
      this.turn = 1.5;
    });
    this.add(wind);
    this.skill_buttons.push(wind);

    const tornado = new Button(370 + 188, 717, true, 0.5, 60, "tornado", () => {
      for (let i = 0; i < targets.length; i++) {
        if (!this.enemyArray[i].isKilled()) {
          targets[i].pos.x -= 1500;
        }
      }
      this.task = (target, pos) => {
        cancel.pos.x += 1500;
        let sn = new Skill();
        this.add(sn);
        let time = sn.tornado(
          this.heroArray[0].magic,
          this.heroArray[0].buffs,
          target,
          ex.vec(973, pos),
          this.heroArray[0].dmg
        );
        this.heroArray[0].actions.delay(time + 50);
        //target, pos;
      };
      this.hideButtons();
      cancel.pos.x -= 1500;
    });
    this.add(tornado);
    this.skill_buttons.push(tornado);
    /* ------------- ------------- -------------*/
    for (let i = 0; i < this.skill_buttons.length; i++) {
      this.skill_buttons[i].pos.x += 1500;
    }
    const skills = new Button(370, 517, false, 0.5, 60, "Skills", () => {
      //similar functionality to tactics => if skill buttons show -> hide, hidden -> show
      if (this.skill_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.skill_buttons.length; i++) {
          this.skill_buttons[i].pos.x += 1500;
        }
      } else {
        for (let i = 0; i < this.skill_buttons.length; i++) {
          this.skill_buttons[i].pos.x -= 1500;
        }
      }
      //also hides tactic buttons if shown
      if (this.tactics_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.tactics_buttons.length; i++) {
          this.tactics_buttons[i].pos.x += 1500;
        }
      }
    });
    this.add(skills);
    this.buttons.push(skills);
    /* ------------- ------------- -------------*/

    /* ------------- items block -------------*/

    //items do not exist in the game yet, but are planned to be introduced in the chapter 1(yep current one)

    /* ------------- ------------- -------------*/
    const items = new Button(370, 567, false, 0.5, 60, "Items", () => {});
    this.add(items);
    this.buttons.push(items);
    /* ------------- ------------- -------------*/

    //temporary buttons that changes current battle background
    const bg = new Button(370, 617, true, 0.5, 40, "Background", () => {
      for (let i = 0; i < this.bgArray.length; i++) {
        this.bgArray[i].kill();
      }
      this.location++;
      this.Background(this.location);
    });
    this.add(bg);
    this.buttons.push(bg);
  }

  //buttons that are shown above enemies to choose the target(one on which skill/attack will be used on);
  //maybe will be shown above player for healing in the future?
  public TargetButtons() {
    var targets: Target[] = [];
    for (let i = 0; i < this.enemyArray.length; i++) {
      const target = new Target(
        this.enemyArray[i].pos.x,
        this.enemyArray[i].pos.y,
        () => {
          this.task(this.enemyArray[i].target, this.enemyArray[i].pos.y);
          this.turn = 1.5;
          this.showButtons();
          for (let i = 0; i < targets.length; i++) {
            //hides all if one is pressed
            targets[i].pos.x += 1500;
          }
        }
      );
      this.add(target);
      targets.push(target);
    }
    //hides initially generated buttons; attack is not chosen yet
    for (let i = 0; i < targets.length; i++) {
      targets[i].pos.x += 1500;
      targets[i].z = 4;
    }
    return targets;
  }

  //hides infoBox on the enemies and all the current buttons except "cancel"(it dissapears alongside the "target" buttons when one of them is pressed)
  public hideButtons() {
    this.removeInfo();
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].pos.x += 1500;
      if (this.tactics_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.tactics_buttons.length; i++) {
          this.tactics_buttons[i].pos.x += 1500;
        }
      }
      if (this.skill_buttons[0].pos.x < 1500) {
        for (let i = 0; i < this.skill_buttons.length; i++) {
          this.skill_buttons[i].pos.x += 1500;
        }
      }
    }
  }

  //shows buttons and adds infoBox-es to enemies
  public showButtons() {
    this.addInfo();
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].pos.x -= 1500;
    }
  }

  public exitBattle(code: number) {
    this.stare.stop();
    const canvas = new ex.Canvas({
      width: 1194,
      height: 834,
      opacity: 1,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1194, 834);
      },
    });
    let canva = new ex.Actor();
    canva.graphics.use(canvas);
    canva.graphics.anchor = ex.Vector.Zero;
    canva.z = 100;
    canva.graphics.opacity = 0;
    this.add(canva);
    canva.actions.fade(1, 1500);
    this.buttons[0].actions.delay(500);
    this.buttons[0].actions.callMethod(() => {
      for (let i in Sounds) {
        Sounds[i as keyof typeof Sounds].volume = 0.5;
      }
    });
    this.buttons[0].actions.delay(500);
    this.buttons[0].actions.callMethod(() => {
      for (let i in Sounds) {
        Sounds[i as keyof typeof Sounds].volume = 0.25;
      }
    });
    this.buttons[0].actions.delay(500);
    this.buttons[0].actions.callMethod(() => {
      for (let i in Sounds) {
        Sounds[i as keyof typeof Sounds].stop();
      }

      if (code == 1) {
        //player lost the battle => lost scene and then back to the world
        this.engine.goToScene("lost");
      } else if (code == 2) {
        //player won the battle => back to world scene and update exp and level there
        this.engine.goToScene("world", [
          code,
          this.heroArray[0].xp,
          this.heroArray[0].level,
        ]);
      } else {
        //(code==0) player run away from battle, simply get back to the world scene
        this.engine.goToScene("world", [code]);
      }
      //clears all the battle variables
      this.clear();
      this.heroArray = [];
      this.enemyArray = [];
      this.turn = 0;
      this.buttons = [];
      this.tactics_buttons = [];
      this.skill_buttons = [];
      this.enemyCounter = 0;
    });
  }
}
