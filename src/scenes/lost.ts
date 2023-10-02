import * as ex from "excalibur";
import { Clock } from "../actors/clock";
import { Difficulty } from "./difficulty";

//scene activated when player lost a battle
export class LostScene extends ex.Scene {
  onActivate(_context: ex.SceneActivationContext<unknown>): void {
    _context.engine.backgroundColor = ex.Color.White;
    let color = "black";
    if ((this.engine.scenes["diff"] as Difficulty).difficulty == 1) {
      //in nightmare difficulty white and black have swapped places
      _context.engine.backgroundColor = ex.Color.Black;
      color = "white";
    }
    const canvas = new ex.Canvas({
      width: 1194,
      height: 834,
      opacity: 1,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1194, 834);
      },
    });
    //background that changes it's color from black to white (or white to black if nightmare)
    var background = new ex.Actor({ x: 0, y: 0 });
    background.z = -1;
    background.graphics.use(canvas);
    background.graphics.anchor = ex.vec(0, 0);
    this.add(background);
    const animsp = 300;
    background.actions.delay(animsp * 10 + animsp * 15 + 50 - animsp * 10);
    background.actions.fade(0, animsp * 6);

    let clock = new Clock(
      597,
      417,
      (this.engine.scenes["diff"] as Difficulty).difficulty == 1 //whether it is the nightmare difficulty and clocks should be demonic
    );
    this.add(clock);
    clock.tick();
    clock.actions.callMethod(() => {
      this.engine.goToScene("world", [1]);
    });
  }

  //restores color and clears the scene on deactivation
  onDeactivate(_context: ex.SceneActivationContext<undefined>): void {
    this.engine.backgroundColor = ex.Color.ExcaliburBlue;
    this.clear();
  }
}
