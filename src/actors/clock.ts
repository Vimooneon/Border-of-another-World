import * as ex from "excalibur";
import { Images } from "../resources";
import { writable } from "./writer";

const clockDefault = new ex.Sprite({
  image: Images.Clock,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const clockArrow = new ex.Sprite({
  image: Images.ClockArrow,
});

const clockArrowD = new ex.Sprite({
  image: Images.ClockArrowD,
});

const clockSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Clock,
  grid: {
    rows: 3,
    columns: 5,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const clockDSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.ClockD,
  grid: {
    rows: 3,
    columns: 5,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const animsp = 300;

const clockAnim = ex.Animation.fromSpriteSheet(
  clockSpriteSheet,
  ex.range(0, 14),
  animsp,
  ex.AnimationStrategy.Loop
);

const clockDAnim = ex.Animation.fromSpriteSheet(
  clockDSpriteSheet,
  ex.range(0, 14),
  animsp,
  ex.AnimationStrategy.Loop
);

export class Clock extends ex.Actor {
  public demonic: boolean;
  constructor(x: number, y: number, demonic: boolean) {
    super({
      pos: new ex.Vector(x, y),
    });
    this.demonic = demonic;
  }

  public onInitialize(_engine: ex.Engine): void {
    this.z = 1;
    this.graphics.use(clockDefault);
  }

  public tick() {
    //clock, arrow and text animation
    var t = "But the hope in your heart";
    var t2 = "";

    let desc = new writable();
    this.addChild(desc);
    desc.pos = ex.vec(desc.oldPos.x, desc.oldPos.y - 350);

    let desc2 = new writable();
    this.addChild(desc2);
    desc2.pos = ex.vec(desc.oldPos.x, desc.oldPos.y - 300);

    //    arrow
    const rotation = Math.PI; //the angle to rotate the clock arrow
    const rotationTime = rotation / ((animsp * 10) / 1000); //the time rotation is supposed to take
    // changepos => custom coordinates for the arrow, to match the clock center
    const changeposy = 20;
    const changeposx = 3;
    const anch = 0.9; //y coordinate anchor for the arrow, the rotation point
    let arrow = new ex.Actor();
    arrow.graphics.anchor = ex.vec(0.5, anch);
    arrow.graphics.use(clockArrow);
    arrow.z = 2;
    this.addChild(arrow);
    arrow.pos = ex.vec(
      arrow.oldPos.x + changeposx,
      arrow.oldPos.y + changeposy
    );
    //    ------
    // the first line of text is the same for both clocks
    this.actions.callMethod(() => {
      desc.Write(t, 30, (animsp * 10) / t.length);
    });
    this.actions.delay(animsp * 10);

    if (!this.demonic) {
      //normal variant of clock (dream difficulty)
      desc.fcolor = ex.Color.White;
      t2 = "stays forever strong";
      desc2.fcolor = ex.Color.Azure;

      this.actions.callMethod(() => {
        desc2.Write(t2, 30, (animsp * 9) / t2.length);
      });
      arrow.actions.rotateBy(rotation, rotationTime, ex.RotationType.Clockwise);
      arrow.actions.delay(50);
      arrow.actions.callMethod(() => {
        this.graphics.use(clockAnim).reset();
      });
      arrow.actions.rotateBy(
        rotation,
        rotationTime,
        ex.RotationType.CounterClockwise
      );
      arrow.actions.fade(0, 200);
      this.actions.delay(animsp * 10 + animsp * 15 + 50 - animsp * 10);
    } else {
      //demonic version of the clock (nightmare difficulty)
      desc.fcolor = ex.Color.Black;
      t2 = "is shattered to pieces";
      desc2.fcolor = ex.Color.Red;

      this.actions.callMethod(() => {
        desc2.Write(t2, 30, (animsp * 9) / t2.length);
      });
      arrow.actions.rotateBy(rotation, rotationTime, ex.RotationType.Clockwise);
      arrow.actions.delay(50);
      arrow.actions.callMethod(() => {
        this.graphics.use(clockDAnim).reset();
        arrow.graphics.use(clockArrowD);
      });
      arrow.actions.rotateBy(
        rotation,
        rotationTime * 2,
        ex.RotationType.Clockwise
      );
      arrow.actions.fade(0, 200);
      arrow.actions.delay(animsp * 10 - 800);
      arrow.actions.fade(1, 300);
      this.actions.delay(animsp * 10 + animsp * 15 + 50 - animsp * 10);
    }
  }
}
