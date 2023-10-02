import * as ex from "excalibur";

const Images = {
  //objects
  Journal: new ex.ImageSource("./images/Journal.png"),
  Table1: new ex.ImageSource("./images/Table1.png"),
  Table2: new ex.ImageSource("./images/Table2.png"),
  Chest: new ex.ImageSource("./images/chest.png"),
  //backgrounds
  Plains: new ex.ImageSource("./images/Plains2.png"),
  Clouds: new ex.ImageSource("./images/Clouds2.png"),
  Pyramid: new ex.ImageSource("./images/Pyramid.png"),
  GhostTown: new ex.ImageSource("./images/GhostTown.png"),
  BlackHole: new ex.ImageSource("./images/BlackHole2.png"),
  Forest: new ex.ImageSource("./images/Forest.png"),
  //tiles
  TileGrass: new ex.ImageSource("./images/TileGrass.png"),
  TileDirt: new ex.ImageSource("./images/TileHalfGrass.png"),
  TileGrassNStones: new ex.ImageSource("./images/TileStoneGrass.png"),
  TileStone: new ex.ImageSource("./images/TileStone.png"),
  TileStoneWall: new ex.ImageSource("./images/TileStoneWall.png"),
  //heroes
  Hero: new ex.ImageSource("./images/Hero.png"),
  HeroWalk: new ex.ImageSource("./images/HeroWalk.png"),
  HeroHand: new ex.ImageSource("./images/HeroHand.png"),
  //enemies
  Grasshopper: new ex.ImageSource("./images/GrasshopperJump.png"),
  GrasshopperIdle: new ex.ImageSource("./images/GrasshopperIdle.png"),
  GrasshopperD: new ex.ImageSource("./images/GrasshopperJumpD.png"),
  RhinocerosBeetle: new ex.ImageSource("./images/RhinoBeetle.png"),
  Bee: new ex.ImageSource("./images/Bee.png"),
  Spider: new ex.ImageSource("./images/Spider.png"),
  //utilitie
  Button: new ex.ImageSource("./images/Button.png"),
  Target: new ex.ImageSource("./images/Target.png"),
  Info: new ex.ImageSource("./images/Info.png"),
  InfoBox: new ex.ImageSource("./images/InfoBox.png"),
  Clock: new ex.ImageSource("./images/Clock.png"),
  ClockArrow: new ex.ImageSource("./images/Clock_arrow2.png"),
  ClockD: new ex.ImageSource("./images/ClockD.png"),
  ClockArrowD: new ex.ImageSource("./images/Clock_arrowD.png"),
  //medals
  MedalBronze: new ex.ImageSource("./images/MedalBronze.png"),
  MedalSilver: new ex.ImageSource("./images/MedalSilver.png"),
  MedalGold: new ex.ImageSource("./images/MedalGold.png"),
  MedalDiamond: new ex.ImageSource("./images/MedalDiamond.png"),
  MedalLegDay: new ex.ImageSource("./images/MedalLegDay.png"),
  MedalPest: new ex.ImageSource("./images/MedalPestControl.png"),
  MedalIce: new ex.ImageSource("./images/MedalIceCold.png"),
  MedalEye: new ex.ImageSource("./images/MedalStare.png"),
  //skills
  Snow: new ex.ImageSource("./images/Snow.png"),
  //weapons
  SwordCarrot: new ex.ImageSource("./images/SwordCarrot.png"),
  SwordBaton: new ex.ImageSource("./images/SwordBaton.png"),
};

const Sounds = {
  world1: new ex.Sound("./sounds/plant_brick_mp3.mp3"),
  battle1: new ex.Sound("./sounds/Meadow.mp3"),
  bee: new ex.Sound("./sounds/T_H_E_N.mp3"),
  spider: new ex.Sound("./sounds/crystal_anthem.mp3"),
};

for (let i in Sounds) {
  Sounds[i as keyof typeof Sounds].loop = true;
}

const loader = new ex.Loader();

//game launches immidietly after loading, without pressing the Start button
loader.suppressPlayButton = true;

const allResources = { ...Images, ...Sounds };
for (const res in allResources) {
  loader.addResource(allResources[res as keyof typeof allResources]);
}

export { Images, Sounds, loader };
