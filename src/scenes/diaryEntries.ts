import * as ex from "excalibur";
import { writable } from "../actors/writer";
import { Button } from "../actors/buttons/button_abstract";

export class Diary extends ex.Scene {
  onActivate(_context: ex.SceneActivationContext<unknown>): void {
    //currently simply writes the given text, but certainly will be remade
    const back = new Button(597, 834 - 60, true, 0.5, 60, "Back", () => {
      _context.engine.goToScene("world");
      this.clear();
    });
    this.add(back);

    var wr = new writable();
    wr.graphics.anchor = ex.Vector.Zero;
    wr.pos = ex.vec(25, 50);
    wr.Write(_context.data as string, 30, 20);
    this.add(wr);
  }
}
