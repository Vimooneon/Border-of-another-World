import * as ex from "excalibur";
import { Button } from "../actors/buttons/button_abstract";
import { writable } from "../actors/writer";

export class Difficulty extends ex.Scene {
  public difficulty: number = 0; //0 = dream, 1 = nightmare

  public onInitialize(_engine: ex.Engine): void {
    var wr = new writable();
    wr.pos = ex.vec(597, 300);
    wr.currentText = "Current difficulty: Dream";
    wr.updateText();
    this.add(wr);
    const difficulty = new Button(597, 400, true, 0.5, 60, "Change", () => {
      if (this.difficulty == 0) {
        this.difficulty = 1;
        wr.Write("Current difficulty: Nightmare", 30, 20);
      } else {
        this.difficulty = 0;
        wr.Write("Current difficulty: Dream", 30, 20);
      }
    });
    this.add(difficulty);

    const play = new Button(597, 500, true, 0.5, 60, "Play", () => {
      _engine.goToScene("app", "Welcome to BoaW, my name is 3nc0d3d \nThe game is still heavily work in progress, so stuff may break \nThanks for trying out the game and hope you have fun!");
    });
    this.add(play);

    const back = new Button(597, 600, true, 0.5, 60, "Back", () => {
      _engine.goToScene("menu");
    });
    this.add(back);
  }
}
