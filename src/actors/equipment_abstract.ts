import * as ex from "excalibur";

export class Equipment {
  public image?: ex.Sprite; //image of the equipment if any
  public hp = 0; //health points that the equipment adds
  public def = 0; //physical defense that the equipment adds
  public def_magic = 0; //magic defense that the equipment adds
  public attack = 0; //physical power that the equipment adds
  public magic = 0; //magic power that the equipment adds
  public elemental_res: { [key: string]: number } = {}; //additional resistance based on the equipment
  public element = ""; //attack element for the weapon
  public skill?: () => any; //skill that the weapon may cast on attack
  constructor(
    hp: number,
    def: number,
    def_magic: number,
    attack: number,
    magic: number,
    elemental_res: { [key: string]: number } = {},
    image?: ex.Sprite,
    element?: string,
    skill?: () => any
  ) {
    this.hp = hp;
    this.def = def;
    this.def_magic = def_magic;
    this.attack = attack;
    this.magic = magic;
    this.elemental_res = elemental_res;
    if (image != undefined) {
      this.image = image;
    }
    if (element != undefined) {
      this.element = element;
    }
    if (skill != undefined) {
      this.skill = skill;
    }
  }
}
