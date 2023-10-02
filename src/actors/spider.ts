import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";
import { Skill } from "./skills/skills";

const spiderDefault = new ex.Sprite({
  image: Images.Spider,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const spiderSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Spider,
  grid: {
    rows: 4,
    columns: 5,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 100;
const animsp2 = 100;

export class Spider extends Enemy {
  constructor(level: number) {
    super();
    this.level = level;
    this.hp = 220;
    this.def = 10;
    this.attack = 30;
    this.def_magic = 10;
    this.magic = 40;
    this.xp = 1000;
    this.skills = ["ice touch", "snow cloud"];
    this.elemental_res = {
      fire: -50,
      water: 25,
      ice: 75,
      wind: -50,
    };
  }

  onInitialize() {
    this.graphics.add(spiderDefault);
    this.leveledStats(this.level);
  }

  public ice_touch() {
    const walkAnim = ex.Animation.fromSpriteSheet(
      spiderSpriteSheet,
      ex.range(0, 8),
      animsp,
      ex.AnimationStrategy.End
    );
    const attackAnim = ex.Animation.fromSpriteSheet(
      spiderSpriteSheet,
      ex.range(9, 19),
      animsp2,
      ex.AnimationStrategy.End
    );

    const heropos = 317;
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(597, heropos), animsp * 8);
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    //221 is hero x pos, and 150 is a distance needed for spider to not stand directly in the player (that way it looks like he attacks the air behind the player)
    this.actions.easeTo(ex.vec(221 + 250, heropos), animsp * 8);
    this.actions.callMethod(() => {
      this.graphics.use(attackAnim).reset();
    });
    this.actions.delay(5 * animsp2);
    this.actions.callMethod(() => {
      this.dealDamage(50, false, "ice", 1);
    });
    this.actions.delay(5 * animsp2);
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(597, heropos), animsp * 8);
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(this.pos.x, this.pos.y), animsp * 8);
    this.actions.callMethod(() => {
      this.graphics.use(spiderDefault);
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

    //temporary to test animations
    if (engine.input.keyboard.wasReleased(ex.Keys.T)) {
      //this.ice_touch();
      let sn = new Skill();
      this.addChild(sn);
      const heropos = 317;
      sn.snowCloud(
        this.magic,
        this.buffs,
        1,
        ex.vec(221 - this.pos.x, heropos - this.pos.y),
        this.dmg
      );
      sn.dealDamage(50, true, "ice", 1, this.magic, this.buffs);
    }

    super.update(engine, delta);
  }

  public useSkill(): void {
    if (!this.demonic) {
      if (Math.random() * 10 <= 5) {
        //50% chance to use each skill (might be changed for dream difficulty)
        this.ice_touch();
      } else {
        let sn = new Skill();
        this.addChild(sn);
        const heropos = 317;
        let time = sn.snowCloud(
          this.magic,
          this.buffs,
          1,
          ex.vec(221 - this.pos.x, heropos - this.pos.y),
          this.dmg
        );
        this.actions.delay(time + 50);
      }
    } else {
      if (Math.random() * 10 <= 5) {
        //50% chance to use each skill (ceartainly will be different for nightmare difficulty in the future)
        this.ice_touch();
      } else {
        let sn = new Skill();
        this.addChild(sn);
        const heropos = 317;
        let time = sn.snowCloud(
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
}
