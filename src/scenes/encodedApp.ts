
import * as ex from "excalibur";
import { writable } from "../actors/writer";
import { Button } from "../actors/buttons/button_abstract";
import { EncodedApp } from "../actors/3nc0d3d_app";

const scale = 0.5;

export class EncodedAppScene extends ex.Scene {
  onActivate(_context: ex.SceneActivationContext<unknown>): void {
    //currently simply writes the given text, but certainly will be remade
    const back = new Button(597, 834 - 60, true, 0.5, 60, "Begin", () => {
      _context.engine.goToScene("world");
      this.clear();
    });
    this.add(back);

    var wr = new writable();
    wr.fcolor = ex.Color.White;
    wr.graphics.anchor = ex.Vector.Zero;
    wr.pos = ex.vec(25, 50);
    wr.Write(_context.data as string, 30, 5);
    this.add(wr);

    //3nc0d3d test
    _context.engine.backgroundColor = ex.Color.Black;
    let enc = new EncodedApp();
    enc.changeAppMood(4);
    enc.scale = ex.vec(0.5, 0.5);
    enc.pos = ex.vec((2388-417/2) * scale, (1668-597/2) * scale);
    this.add(enc);
  }
}




