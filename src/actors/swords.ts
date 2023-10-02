import { Equipment } from "./equipment_abstract";
import { Images } from "../resources";

export const swordCarrot = new Equipment(
  0,
  0,
  0,
  25,
  15,
  { fire: -15, water: 5, wind: -5 },
  Images.SwordCarrot.toSprite()
);

export const swordBaton = new Equipment(
  0,
  0,
  0,
  30,
  5,
  { fire: 5, water: 5, wind: 5, ice: 5, electricity: 15 },
  Images.SwordBaton.toSprite()
);
