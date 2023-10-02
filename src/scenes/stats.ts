import * as ex from "excalibur";
import { PlayerInBattle } from "../actors/hero";
import { damage } from "../actors/damage";
import { writable } from "../actors/writer";
import { Button } from "../actors/buttons/button_abstract";
import { World } from "./world";
import { swordBaton, swordCarrot } from "../actors/swords";

export class Stats extends ex.Scene {
  onActivate(_context: ex.SceneActivationContext<unknown>): void {
    this.layout(_context);
  }

  public layout(_context: ex.SceneActivationContext<unknown>) {
    const back = new Button(597, 834 - 60, true, 0.5, 60, "Back", () => {
      _context.engine.goToScene("world");
      this.clear();
    });
    this.add(back);

    //is used for the texture and leveled stats calculation
    var hero = new PlayerInBattle(
      597,
      417,
      (_context.data as number[])[0],
      new damage(),
      (_context.engine.scenes["world"] as World).sword
    );
    //hero.scale = ex.vec(1, 1);
    this.add(hero);
    let lvl = new writable();
    lvl.pos = ex.vec(597, 150);
    this.add(lvl);
    lvl.Write(
      "Current level: " + (_context.data as number[])[0].toString(),
      30,
      40
    );

    let exp = new writable();
    exp.pos = ex.vec(597, 200);
    this.add(exp);
    exp.Write(
      "EXP:" +
        (_context.data as number[])[1].toString() +
        "/" +
        (100 * (_context.data as number[])[0]).toString(),
      30,
      40
    );
    //hero.onInitialize();

    hero.on("initialize", () => {
      //hero.leveledStats(hero.level);
      this.stats(hero);
      //elemental resistance
      this.addRes("ice", hero, 350);
      this.addRes("water", hero, 400);
      this.addRes("fire", hero, 450);
      this.addRes("wind", hero, 500);
      this.addRes("electricity", hero, 550);
    });

    this.add(
      new Button(470, 650, true, 0.5, 60, "weapon", () => {
        if ((_context.engine.scenes["world"] as World).sword == swordBaton) {
          (_context.engine.scenes["world"] as World).sword = swordCarrot;
        } else if (
          (_context.engine.scenes["world"] as World).sword == swordCarrot
        ) {
          (_context.engine.scenes["world"] as World).sword = swordBaton;
        }
        this.clear();
        this.layout(_context);
      })
    );

    this.add(
      new Button(670, 650, true, 0.5, 60, "armor", () => {
        if ((_context.engine.scenes["world"] as World).sword == swordBaton) {
          (_context.engine.scenes["world"] as World).sword = swordCarrot;
        } else if (
          (_context.engine.scenes["world"] as World).sword == swordCarrot
        ) {
          (_context.engine.scenes["world"] as World).sword = swordBaton;
        }

        this.clear();
        this.layout(_context);
      })
    );
  }

  onDeactivate(_context: ex.SceneActivationContext<undefined>): void {
    this.clear();
  }

  public addRes(el: string, hero: PlayerInBattle, y: number) {
    let res = "0"; //case if resistance is not defined => 0% resistance
    if (!isNaN(hero.elemental_res[el])) {
      res = hero.elemental_res[el].toString();
    }
    let wrx = new writable();
    wrx.pos = ex.vec(150, y);
    wrx.anchor = ex.Vector.Zero;
    this.add(wrx);
    wrx.Write(el + " resistance: " + res + "%", 30, 40);
  }

  public stats(hero: PlayerInBattle) {
    let hp = new writable();
    hp.pos = ex.vec(700, 350);
    hp.anchor = ex.Vector.Zero;
    this.add(hp);
    hp.Write("Current HP: " + hero.hp.toString(), 30, 40);
    let attack = new writable();
    attack.pos = ex.vec(700, 400);
    attack.anchor = ex.Vector.Zero;
    this.add(attack);
    attack.Write("Current attack: " + hero.attack.toString(), 30, 40);
    let defense = new writable();
    defense.pos = ex.vec(700, 450);
    defense.anchor = ex.Vector.Zero;
    this.add(defense);
    defense.Write("Current defense: " + hero.def.toString(), 30, 40);
    let magic = new writable();
    magic.pos = ex.vec(700, 500);
    magic.anchor = ex.Vector.Zero;
    this.add(magic);
    magic.Write("Current magic: " + hero.magic.toString(), 30, 40);
    let magicDef = new writable();
    magicDef.pos = ex.vec(700, 550);
    magicDef.anchor = ex.Vector.Zero;
    this.add(magicDef);
    magicDef.Write(
      "Current magic defense: " + hero.def_magic.toString(),
      30,
      40
    );
  }
}
