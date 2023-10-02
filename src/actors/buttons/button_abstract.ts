import * as ex from "excalibur";
import { Images } from "../../resources";

//default button image = animation image[0]
const buttonDefault = new ex.Sprite({
  image: Images.Button,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 101,
  },
});

const buttonSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Button,
  grid: {
    rows: 1,
    columns: 7,
    spriteHeight: 101,
    spriteWidth: 376,
  },
});

const animsp = 100;

export class Button extends ex.Actor {
  public text: string;
  public method; //what happens when you click the buttons
  public blink: boolean; //the button blinks(becomes visible and not visible) for some time before executing the method
  public font: number;
  constructor(
    x: number,
    y: number,
    blink: boolean,
    scale: number,
    font: number,
    text: string,
    method: () => any
  ) {
    super({
      pos: new ex.Vector(x, y),
      width: 376,
      height: 101,
      name: text.toLowerCase(),
      scale: ex.vec(scale, scale),
    });
    this.text = text;
    this.method = method;
    this.blink = blink;
    this.font = font;
  }

  public onInitialize(_engine: ex.Engine): void {
    //this.graphics.anchor = ex.vec(0, 0);
    const buttonAnim = ex.Animation.fromSpriteSheet(
      buttonSpriteSheet,
      ex.range(0, 6),
      animsp,
      ex.AnimationStrategy.Loop
    );
    this.z = 2;
    //starts animation when pointer enters the button
    this.on("pointerenter", () => {
      this.graphics.use(buttonAnim);
    });
    //and ends it wherever it leaves
    this.on("pointerleave", () => {
      this.graphics.use(buttonDefault);
    });
    this.on("pointerup", () => {
      if (this.blink) {
        this.actions.blink(200, 150, 3);
      } else {
        this.graphics.use(buttonAnim);
      }
      this.actions.callMethod(() => {
        this.method();
      });
    });

    var text = new ex.Text({
      text: this.text,
      font: new ex.Font({ size: this.font }),
    });
    //foreground layer with text
    this.graphics.layers.create({
      name: "foreground",
      order: 1,
      offset: ex.vec(0, Math.round(this.font / 1.5)),
    });
    this.graphics.layers.get("foreground").use(text);
    this.graphics.use(buttonDefault);
  }
}
