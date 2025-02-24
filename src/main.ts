//excalibur imports
//import * as ex from "excalibur";
import { Engine } from "excalibur";
import { loader } from "./resources";
//my scenes
import { BattleScene } from "./scenes/battle";
import { MainMenu } from "./scenes/mainmenu";
import { Achievements } from "./scenes/achievements";
import { LostScene } from "./scenes/lost";
import { Difficulty } from "./scenes/difficulty";
import { World } from "./scenes/world";
import { Diary } from "./scenes/diaryEntries";
import { Stats } from "./scenes/stats";
import { EncodedAppScene } from "./scenes/encodedApp";

//sadly had to decrease the initial planned size (scale = 1)
const scale = 0.5;

class Game extends Engine {
  constructor() {
    //2388x1668 is the original resolution of the background
    super({ width: 2388 * scale, height: 1668 * scale }); //scale = 0.5 => actual size (1194 * 834), scale = 0.25 => (597 * 417)
  }
  initialize() {
    this.addScene("battle", new BattleScene());
    this.addScene("menu", new MainMenu());
    this.addScene("achievements", new Achievements());
    (this.scenes["achievements"] as Achievements).Init(); //initialises all achievements
    this.addScene("lost", new LostScene());
    this.addScene("diff", new Difficulty());
    this.addScene("world", new World());
    this.addScene("diary", new Diary());
    this.addScene("stats", new Stats());
    this.addScene("app", new EncodedAppScene());
    this.goToScene("menu");
  }
}

export const game = new Game();
game.start(loader).then(() => {
  game.initialize();
});
