import * as ex from "excalibur";
import { Images } from "../../resources";

const buttonDefault = new ex.Sprite({
  image: Images.Target,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const buttonSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Target,
  grid: {
    rows: 2,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 75;

export class Target extends ex.Actor {
  public method;
  constructor(x: number, y: number, method: () => any) {
    super({
      pos: new ex.Vector(x, y),
      width: 376,
      height: 376,
      scale: ex.vec(0.25, 0.25),
    });
    this.method = method;
  }

  public onInitialize(_engine: ex.Engine): void {
    //this.graphics.anchor = ex.vec(0, 0);
    const buttonAnim = ex.Animation.fromSpriteSheet(
      buttonSpriteSheet,
      ex.range(0, 7),
      animsp,
      ex.AnimationStrategy.Loop
    );
    this.z = 2;
    this.on("pointerenter", () => {
      this.graphics.use(buttonAnim);
    });
    this.on("pointerleave", () => {
      this.graphics.use(buttonDefault);
    });
    this.on("pointerup", () => {
      this.actions.callMethod(() => {
        this.method();
      });
    });

    this.graphics.use(buttonDefault);
  }
}
