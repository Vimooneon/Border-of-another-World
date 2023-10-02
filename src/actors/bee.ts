import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";

const beeDefault = new ex.Sprite({
  image: Images.Bee,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const beeSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Bee,
  grid: {
    rows: 4,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 125;

export class Bee extends Enemy {
  constructor(level: number) {
    super({
      scale: ex.vec(0.75, 0.75),
    });
    this.level = level;
    this.hp = 150;
    this.def = 15;
    this.attack = 50;
    this.def_magic = 15;
    this.magic = 30;
    this.xp = 100;
    this.skills = ["fly"];
    this.elemental_res = {
      fire: -50,
      water: -25,
      ice: -75,
      wind: 50,
    };
  }

  onInitialize() {
    this.graphics.add(beeDefault);
    this.leveledStats(this.level);
  }

  public fly() {
    const flyAnim = ex.Animation.fromSpriteSheet(
      beeSpriteSheet,
      ex.range(0, 10),
      animsp,
      ex.AnimationStrategy.Freeze
    );
    const heropos = 317; //temporary constant, will change the moment game will have multiple players
    this.actions.callMethod(() => {
      this.graphics.use(flyAnim).reset();
    });
    this.actions.easeTo(ex.vec(221 + 50, heropos - 70), animsp * 10);
    this.actions.delay(100);
    this.actions.callMethod(() => {
      this.dealDamage(120, false, "wind", 1);
    });
    //this most probably will be reworked in the future:
    this.off("kill"); //since the player did not defeat bee (and should be most probably dead from this attack), the medal that detects "kill" won't be given
    this.die();
    this.actions.delay(50);
  }

  public die() {
    const dieAnim = ex.Animation.fromSpriteSheet(
      beeSpriteSheet,
      ex.range(11, 15),
      animsp,
      ex.AnimationStrategy.Freeze
    );
    this.actions.callMethod(() => {
      this.graphics.use(dieAnim).reset();
    });
    this.actions.delay(animsp * 4);
    this.actions.fade(0, 600);
    this.actions.die();
  }

  public update(engine: ex.Engine, delta: number) {
    if (this.hp <= 0) {
      this.die();
    }

    if (this.dmg.target == this.target) {
      this.takeDamage(this.dmg.amount, this.dmg.magic, this.dmg.element);
      this.dmg.target = 0;
    }

    //temporary to test animations
    if (engine.input.keyboard.wasReleased(ex.Keys.Y)) {
      this.fly();
    }

    super.update(engine, delta);
  }

  public useSkill(): void {
    this.fly();
  }
}
