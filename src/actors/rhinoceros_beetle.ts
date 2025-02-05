import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";

const rhinocerosBeetleDefault = new ex.Sprite({
  image: Images.RhinocerosBeetle,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const rhinocerosBeetleSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.RhinocerosBeetle,
  grid: {
    rows: 4,
    columns: 5,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 150;
const animsp2 = 100;

export class RhinocerosBeetle extends Enemy {
  constructor(level: number) {
    super({
      scale: ex.vec(0.5, 0.5),
    });
    this.level = level;
    this.hp = 150;
    this.def = 30;
    this.attack = 15;
    this.def_magic = 20;
    this.magic = 1;
    this.xp = 100;
    this.skills = ["ram"];
    this.elemental_res = {
      fire: 25,
      water: 75,
      ice: 25,
      wind: -50,
    };
  }

  onInitialize() {
    this.graphics.add(rhinocerosBeetleDefault);
    this.leveledStats(this.level);
  }

  public ram(target: number) {
    const walkAnim = ex.Animation.fromSpriteSheet(
      rhinocerosBeetleSpriteSheet,
      ex.range(0, 8),
      animsp,
      ex.AnimationStrategy.End
    );
    const attackAnim = ex.Animation.fromSpriteSheet(
      rhinocerosBeetleSpriteSheet,
      ex.range(9, 19),
      animsp2,
      ex.AnimationStrategy.End
    );
    const heropos = 317; //temporary constant
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(597, heropos), animsp * 4);
    this.actions.easeTo(ex.vec(221 + 80, heropos), animsp * 4);
    this.actions.callMethod(() => {
      this.graphics.use(attackAnim).reset();
    });
    this.actions.delay(5 * animsp2);
    this.actions.callMethod(() => {
      this.dealDamage(50, false, "water", target);
    });
    this.actions.delay(5 * animsp2);
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(597, heropos), animsp * 4);
    this.actions.easeTo(ex.vec(this.pos.x, this.pos.y), animsp * 4);
    this.actions.callMethod(() => {
      this.graphics.use(rhinocerosBeetleDefault);
    });
    this.actions.delay(50);
  }

  public update(engine: ex.Engine, delta: number) {
    if (this.hp <= 0) {
      this.die();
    }
    if (this.dmg.target == this.target) {
      this.takeDamage(this.dmg.amount, this.dmg.magic, this.dmg.element);
      this.dmg.target = 0;
    }
    super.update(engine, delta);
  }

  public useSkill(target: number): void {
    this.ram(target);
  }
}
