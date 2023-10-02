import * as ex from "excalibur";
import { Images } from "../resources";

//used for showing achievements description
export class Description extends ex.Actor {
  public font: number;
  constructor(x: number, y: number, scale: number, font: number) {
    super({
      pos: new ex.Vector(x, y),
      width: 376,
      height: 101,
      name: "description",
      scale: ex.vec(scale, scale),
    });
    this.font = font;
  }

  //method that sets the visible text and creates a half-transparent white layer as the background it
  public updateText(t: string) {
    const canvas = new ex.Canvas({
      width: t.length * 12,
      height: 80,
      opacity: 0.5,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, t.length * 12, 100);
      },
    });
    this.graphics.layers.get("background").use(canvas);

    var text = new ex.Text({
      text: t,
      font: new ex.Font({ size: this.font }),
    });
    this.graphics.use(text);
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.vec(0, 0);
    this.graphics.layers.create({
      name: "background",
      order: -1,
      offset: ex.vec(0, -30),
    });
    this.z = 3;
  }
}

const infoBoxDefault = new ex.Sprite({
  image: Images.InfoBox,
});
//used in battle to show information about a given enemy
export class InfoBox extends ex.Actor {
  public el_res: { [key: string]: number };
  constructor(
    x: number,
    y: number,
    scale: number,
    el_res: { [key: string]: number } //enemy's elemental resistancies
  ) {
    super({
      pos: new ex.Vector(x, y),
      width: 376,
      height: 376,
      name: "infobox",
      scale: ex.vec(scale, scale),
    });
    this.el_res = el_res;
  }

  public updateText(t: string) {
    var text = new ex.Text({
      text: t,
      font: new ex.Font({ size: 50 }),
    });
    this.graphics.use(text);
  }

  public onInitialize(_engine: ex.Engine): void {
    this.z = 3;
    this.graphics.anchor = ex.vec(0, 0);
    //offset caused by the difference of the text and background layers position
    const offx = -20;
    const offy = -70;
    this.graphics.layers.create({
      name: "background",
      order: -1,
      offset: ex.vec(offx, offy),
    });
    this.graphics.layers.get("background").use(infoBoxDefault);

    //create a seperate layer for each elemental weakness/resistance
    this.graphics.layers.create({
      name: "ice",
      order: 1,
      offset: ex.vec(26, 140),
    });
    this.graphics.layers.create({
      name: "water",
      order: 1,
      offset: ex.vec(136, 140),
    });
    this.graphics.layers.create({
      name: "fire",
      order: 1,
      offset: ex.vec(236, 140),
    });
    this.graphics.layers.create({
      name: "wind",
      order: 1,
      offset: ex.vec(68, 250),
    });
    this.graphics.layers.create({
      name: "electricity",
      order: 1,
      offset: ex.vec(222, 250),
    });
    //shows the resistance percentage
    this.elementalRes("ice");
    this.elementalRes("water");
    this.elementalRes("fire");
    this.elementalRes("wind");
    this.elementalRes("electricity");
    this.z = 3;
  }

  public elementalRes(el: string) {
    var col: ex.Color = ex.Color.White;
    if (isNaN(this.el_res[el])) {
      //if there is no resistance it is showed as NaN, which means no number is shown (better than just showing "0%")
      return;
    }
    if (this.el_res[el] > 100) {
      //if the enemy have more than 100% resistance to an element it is healed by such attack and the resistance is highlighted green text
      col = ex.Color.Green;
    }
    if (this.el_res[el] < 0) {
      //if the enemy is weak to an element it is highlighted with red text
      col = ex.Color.Red;
    }
    var text = new ex.Text({
      text: this.el_res[el].toString() + "%",
      font: new ex.Font({ size: 50, color: col }),
    });
    this.graphics.layers.get(el).use(text);
    this.graphics.use(text);
  }
}
