import * as ex from "excalibur";
import { Images } from "../resources";

const cloud = Images.Clouds.toSprite();
const plains = Images.Plains.toSprite();

const pyramidSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Pyramid,
  grid: {
    rows: 3,
    columns: 4,
    spriteWidth: 597,
    spriteHeight: 417,
  },
});

const pyramidAnimsp = 300;

const pyramidAnim = ex.Animation.fromSpriteSheet(
  pyramidSpriteSheet,
  ex.range(0, 11),
  pyramidAnimsp,
  ex.AnimationStrategy.Loop
);

const townSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.GhostTown,
  grid: {
    rows: 2,
    columns: 4,
    spriteWidth: 597,
    spriteHeight: 417,
  },
});

const townAnimsp = 200;

const townAnim = ex.Animation.fromSpriteSheet(
  townSpriteSheet,
  ex.range(0, 7),
  townAnimsp,
  ex.AnimationStrategy.Loop
);
const galaxySpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.BlackHole,
  grid: {
    rows: 2,
    columns: 2,
    spriteWidth: 597,
    spriteHeight: 417,
  },
});

const galaxyAnimsp = 200;

const galaxyAnim = ex.Animation.fromSpriteSheet(
  galaxySpriteSheet,
  ex.range(0, 3),
  galaxyAnimsp,
  ex.AnimationStrategy.Loop
);

const forestSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.Forest,
  grid: {
    rows: 2,
    columns: 3,
    spriteWidth: 597,
    spriteHeight: 417,
  },
});

const forestAnimsp = 150;

const forestAnim = ex.Animation.fromSpriteSheet(
  forestSpriteSheet,
  ex.range(0, 5),
  forestAnimsp,
  ex.AnimationStrategy.Loop
);

const cloudspeed = 20;

export class Clouds extends ex.Actor {
  constructor(x: number, y: number) {
    super({
      pos: new ex.Vector(x, y),
      //scale: ex.vec(0.5, 0.5),
      vel: ex.vec(cloudspeed, 0),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -98;
    this.graphics.use(cloud);
  }
  public onPostUpdate(_engine: ex.Engine, _delta: number): void {
    if (this.pos.x > 1194) {
      this.pos.x = -1194;
    }
  }
}

export class Plains extends ex.Actor {
  constructor() {
    super({
      pos: new ex.Vector(0, 0),
      //scale: ex.vec(0.5, 0.5),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -99;
    this.graphics.use(plains);
  }
}

export class Pyramid extends ex.Actor {
  constructor() {
    super({
      pos: new ex.Vector(0, 0),
      scale: ex.vec(2, 2),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -99;
    //this.graphics.use(pyramidDefault);
    this.graphics.use(pyramidAnim);
    //this.graphics.use(pyramidAnim).reset();
  }
}

export class GhostTown extends ex.Actor {
  constructor() {
    super({
      pos: new ex.Vector(0, 0),
      scale: ex.vec(2, 2),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -99;
    this.graphics.use(townAnim);
  }
}

export class BlackHole extends ex.Actor {
  constructor() {
    super({
      pos: new ex.Vector(0, 0),
      scale: ex.vec(2, 2),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -99;
    this.graphics.use(galaxyAnim);
    /*galaxyAnim.events.on("ended", () => {
      galaxyAnim.reverse();
      galaxyAnim.reset();
    });*/
  }
}

export class Forest extends ex.Actor {
  constructor() {
    super({
      pos: new ex.Vector(0, 0),
      scale: ex.vec(2, 2),
    });
  }
  public onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    this.z = -99;
    this.graphics.use(forestAnim);
  }
}
