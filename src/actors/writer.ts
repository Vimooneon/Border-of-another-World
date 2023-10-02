import * as ex from "excalibur";

//helpful class for creating a label with text written not instantly, but rather appearing with a certain pace
export class writable extends ex.Actor {
  public endText: string = "";
  public font: number = 30;
  public pace: number = 100;
  public fcolor: ex.Color = ex.Color.Black;
  public currentText: string = "";

  public updateText() {
    var text = new ex.Text({
      text: this.currentText,
      font: new ex.Font({ size: this.font, color: this.fcolor }),
    });
    this.graphics.use(text);
  }

  public Write(t: string, f: number, p: number, del?: boolean) {
    this.actions.clearActions();
    this.currentText = "";
    if (del != undefined && del) {
      //deletes previous written text
      this.updateText();
    }
    this.endText = t;
    this.font = f;
    this.pace = p;

    for (let i = 0; i < this.endText.length; i++) {
      this.actions.delay(this.pace); //how long to wait till next letter
      this.actions.callMethod(() => {
        this.currentText += this.endText.slice(i, i + 1); //maybe not the best way, but gets a letter from the original and adds it to current text
        this.updateText(); //makes the text update visible
      });
    }
  }
}
