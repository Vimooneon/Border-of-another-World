import * as ex from "excalibur";
import { Button } from "../actors/buttons/button_abstract";

export class MainMenu extends ex.Scene {
  //adds buttons to the current scene
  public onInitialize(_engine: ex.Engine): void {
    const play = new Button(597, 367, true, 0.5, 60, "Play", () => {
      _engine.goToScene("diff");
      this.clear();
    });
    this.add(play);
    const options = new Button(597, 417, true, 0.5, 60, "Options", () => {});
    this.add(options);
    const achievements = new Button(597, 467, true, 0.5, 60, "Medals", () => {
      _engine.goToScene("achievements");
      this.clear();
    });
    this.add(achievements);
    const credits = new Button(597, 517, true, 0.5, 60, "Credits", () => {});
    this.add(credits);
    const exit = new Button(597, 567, true, 0.5, 60, "Exit", () => {});
    this.add(exit);
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {
    //The game name and explanation
    var textBoaw = new ex.Text({
      text: "BoaW",
      font: new ex.Font({ size: 75 }),
    });
    var textBoaw2 = new ex.Text({
      text: "Border of another World",
      font: new ex.Font({ size: 50 }),
    });

    let title1 = new ex.Actor({ pos: ex.vec(597, 100) });
    title1.graphics.use(textBoaw);
    this.add(title1);
    let title2 = new ex.Actor({ pos: ex.vec(597, 150) });
    title2.graphics.use(textBoaw2);
    this.add(title2);

    //if player won the game (currently: reached the first meteorite)
    if (_context.data != null && (_context.data as number) == 3) {
      var text = new ex.Text({
        text: "You won",
        font: new ex.Font({ size: 50 }),
      });
      const announcement = new ex.Actor();
      announcement.pos = ex.vec(597, 200);
      announcement.graphics.use(text);
      this.add(announcement);

      var text2 = new ex.Text({
        text: "Thanks for playing",
        font: new ex.Font({ size: 50 }),
      });
      const announcement2 = new ex.Actor();
      announcement2.pos = ex.vec(597, 317);
      announcement2.graphics.use(text2);
      this.add(announcement2);
    }
  }
}
