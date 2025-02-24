import * as ex from "excalibur";
import { Images } from "../resources";

const encodedAppMoods = ex.SpriteSheet.fromImageSource({
    image: Images.EncodedApp,
    grid: {
        rows: 1,
        columns: 5,
        spriteHeight: 597,
        spriteWidth: 417,
    },
});

export class EncodedApp extends ex.Actor {
    public mood:number = 0;

    changeAppMood(mood: number){
        this.mood = mood;
        let sprite = encodedAppMoods.getSprite(mood, 0);
        this.graphics.use((sprite as ex.Sprite));
    }
}