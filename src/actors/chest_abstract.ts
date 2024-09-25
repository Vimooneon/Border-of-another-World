import * as ex from "excalibur";
import { Images } from "../resources";
import { tileSize } from "../maps";

const animsp = 75;

const ChestLadybug = new ex.Sprite({
    image: Images.ChestLadybug,
    sourceView: {
      x: 0,
      y: 0,
      width: 376,
      height: 376,
    },
});

const ChestOpenLadybugSpriteSheet = ex.SpriteSheet.fromImageSource({
image: Images.ChestLadybug,
grid: {
    rows: 2,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
},
});

export class chest extends ex.Actor {
public texture: string;
public begone: boolean;
constructor(x: number, y: number, texture: string, gone: boolean) {
    super({
    pos: new ex.Vector(x, y),
    });
    this.texture = texture;
    this.begone = gone;
    this.scale = new ex.Vector(0.5*tileSize/376, 0.5*tileSize/376);
}

public onInitialize(_engine: ex.Engine): void {
    this.z = 1;
    if (this.texture=="ladybug") {
        this.graphics.use(ChestLadybug);
    }
    this.open()
}

public open(){
    var openAnim = ex.Animation.fromSpriteSheet(
        ChestOpenLadybugSpriteSheet,
        ex.range(0, 5),
        animsp,
        ex.AnimationStrategy.End
    );
    this.actions.callMethod(() => {
        this.graphics.use(openAnim).reset();
    });
    this.actions.delay(animsp*6);
    this.actions.callMethod(() => {
        if (this.begone){
            this.gone()
        }
    });

}

public gone(){
    var goneAnim = ex.Animation.fromSpriteSheet(
        ChestOpenLadybugSpriteSheet,
        ex.range(6, 7),
        animsp,
        ex.AnimationStrategy.Loop
    );
    this.actions.callMethod(() => {
        this.graphics.use(goneAnim).reset();
    });
    this.actions.easeTo(ex.vec(this.pos.x, -376), animsp*(this.pos.y+376)/50);
    this.actions.die()

}

}