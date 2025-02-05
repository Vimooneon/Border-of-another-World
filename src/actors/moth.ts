import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";
import { Skill } from "./skills/skills";

const mothDefault = new ex.Sprite({
  image: Images.Moth,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

export class Moth extends Enemy {
  constructor(level: number) {
    super();
    this.level = level;
    this.hp = 500;
    this.def = 50;
    this.attack = 80;
    this.def_magic = 100;
    this.magic = 120;
    this.xp = 15000;
    this.skills = ["tornado"];
    this.elemental_res = {
      fire: -50,
      water: 25,
      ice: -50,
      wind: 50,
    };
  }

  onInitialize() {
    this.graphics.add(mothDefault);
    this.leveledStats(this.level);
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

  public useSkill(): void {
    if (!this.demonic) {
        let sn = new Skill();
        this.addChild(sn);
        const heropos = 317;
        let time = sn.tornado(
          this.magic,
          this.buffs,
          1,
          ex.vec(221 - this.pos.x, heropos - this.pos.y),
          this.dmg
        );
        this.actions.delay(time + 50);
    } else {
        let sn = new Skill();
        this.addChild(sn);
        const heropos = 317;
        let time = sn.tornado(
          this.magic,
          this.buffs,
          1,
          ex.vec(221 - this.pos.x, heropos - this.pos.y),
          this.dmg
        );
        this.actions.delay(time + 50);
    }
  }
}
