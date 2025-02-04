import * as ex from "excalibur";
import { Tile, Wave, World } from "./scenes/world";
import { Images, Sounds } from "./resources";
import { writable } from "./actors/writer";
import { Spider } from "./actors/spider";
import { RhinocerosBeetle } from "./actors/rhinoceros_beetle";
import { Achievements } from "./scenes/achievements";
import { Bee } from "./actors/bee";
import { Grasshopper } from "./actors/grasshopper";
import { chest } from "./actors/chest_abstract";

export const tileSize = 376; //208

const grass = new ex.Sprite({ image: Images.TileGrass, scale:ex.vec(tileSize/376, tileSize/376)}); //
const Grass = new ex.Sprite({ image: Images.Grass});
//const dirt = new ex.Sprite({ image: Images.TileDirt });
const stone = new ex.Sprite({ image: Images.TileStone, scale:ex.vec(tileSize/376, tileSize/376) });
const stoneWall = new ex.Sprite({ image: Images.TileStoneWall, scale:ex.vec(tileSize/376, tileSize/376) });



var world1Map: Tile[][] = [];

//world builder; probably looks messy and is that way; hopefully will be better in the future
//divides the worldmap into smaller maps - "rooms"(5(height)*7(width) tiles large map) and fills them with according tiles
export function WorldGenerator(world: World) {
  world1Map.push(map0());
  world1Map.push(map1());
  world1Map.push(map2());
  world1Map.push(map3(world));
  world1Map.push(map4());
  world1Map.push(map5());
  world1Map.push(map6(world));
  world1Map.push(map7(world));
  world1Map.push(map8(world));
  world1Map.push(map9());
  world1Map.push(map10());
  world1Map.push(map11());
  world1Map.push(map12());
  world1Map.push(map13());
  world1Map.push(map14(world));
  world1Map.push(map15());
  world1Map.push(map16(world));
  world1Map.push(map17());
  world1Map.push(map18(world));
  world1Map.push(map19(world));
  world1Map.push(map20());
  world1Map.push(map21());
  return world1Map;
}

//a bad solution to creating an empty map?
export function map0() {
  //world: World
  let tempmap: Tile[] = [];
  return tempmap;
}

export function map1() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map2() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 5; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 2; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map3(world: World) {
  let tempmap: Tile[] = [];
  //row1
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row2
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(
    new Tile(stone, false, Images.Spider.toSprite(), (tile: Tile) => {
      let SpiderBoss = new Spider(1);
      SpiderBoss.on("kill", () => {
        let achv = world.engine.scenes["achievements"] as Achievements;
        achv.getAchievement("Ice-cold", world.engine.scenes["battle"]);
      });
      //Sounds.spider.load().then(() => {
      Sounds.spider.volume = 1;
      Sounds.spider.play();
      //});
      world.Wave(
        new Wave(new RhinocerosBeetle(1), SpiderBoss, new RhinocerosBeetle(1))
          .enemies,
        tile
      );
    })
  );
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stoneWall, false));
  //row3
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row4
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(
    new Tile(stone, false, new ex.Sprite({ image: Images.Table1 }), () => {
      //ik it is bad, it will be remade in the future
      world.engine.goToScene(
        "diary",
        "The spider contained here, it seems to have a strong bond to this world, \nit seems as if it is killed that the world will come to an end. " +
          "\n" +
          "I would like to contain it, that way no other travellers may hurt it. " +
          "\n" +
          "If you are reading this, I am begging you, please don't kill it. " +
          "\n"
      );
    })
  );
  tempmap.push(new Tile(stone, false, new ex.Sprite({ image: Images.Table2 })));
  tempmap.push(new Tile(stoneWall, false));
  //row5
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map4() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i = 0; i < 3; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 5; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map5() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map6(world: World) {
  let tempmap: Tile[] = [];
  tempmap.push(new Tile(Grass, false, stoneWall));
  for (let i2 = 0; i2 < 6; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(grass, false, new ex.Sprite({
    image: Images.ChestLadybug,
    sourceView: {
      x: 0,
      y: 0,
      width: 376,
      height: 376,
    },
}), (t)=>{
    t.makeWalkable();
    t.graphics.layers.get("foreground").hide();
    world.add(new chest(t.getGlobalPos().x+94, t.getGlobalPos().y+94, "ladybug", true))
  }));
  tempmap.push(
    new Tile(grass, false, new ex.Sprite({ image: Images.Journal }), () => {
      //yes this is even worse example of the previous occurance, will be reamde!
      world.engine.goToScene(
        "diary",
        "Journal 1:" +
          "\n" +
          "Day 1:" +
          "\n" +
          "I don't know where I am. It seems upon touching the meteorite \n I got transfered to this... place." +
          "\n" +
          "Luckily, I have my journal with me so I can write down the information about this weird place." +
          "\n" +
          "Day 2:" +
          "\n" +
          "It seems this world is inhabited by enormous bugs. I would like to study them closer." +
          "\n" +
          "Day 3:"/* +
          "\n" +
          "Most of the bugs are normally not offensive and won't attack unless provoked. " +
          "\n" +
          "They as well seem to be afraid of fire as when I lit a bonfire, all surrounding bugs moved away." +
          "\n" +
          "Most of them also dislike water." +
          "\n" +
          "(Write about other weaknesses later*)" +
          "\n" +
          "Day 4:" +
          "\n" +
          "I've seen it, another meteorite, similar to the one that transported me into this world, " +
          "\n" +
          "maybe if touch it I'll be transported back into my world." +
          "\n" +
          "But it may as well not work, as the one nearby place of my awakening haven't done anything upon contact." +
          "\n" +
          "It seems it is cracked though, maybe that's why it is not working." +
          "\n" +
          "Day 5:" +
          "\n" +
          "To reach the meteorite I would have to go through cave, it seems to be inhabited by spiders." +
          "\n" +
          "I'll try to describe one of those here:" +
          "\n" +
          "[Entity Spider]:[Health = x, defence = x, magic defence = x, elemental weaknesses: fire, water, (something else?)]"*/
      );
    })
  );

  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i = 0; i < 3; i++) {
    for (let i2 = 0; i2 < 7; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map7(world: World) {
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false), new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(
    new Tile(stone, false, Images.RhinocerosBeetle.toSprite(), (tile: Tile) => {
      Sounds.battle1.volume = 1;
      Sounds.battle1.play();
      world.Wave(new Wave(undefined, new RhinocerosBeetle(1)).enemies, tile);
    })
  );
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false), new Tile(stoneWall, false));
  for (let i = 0; i < 2; i++) {
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map8(world: World) {
  let tempmap: Tile[] = [];
  //row 1
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 2
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stone));
  }
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  //row 3
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  //row 4
  tempmap.push(new Tile(stoneWall, false));
  tempmap.push(new Tile(stone));
  tempmap.push(
    new Tile(stone, false, Images.RhinocerosBeetle.toSprite(), (tile: Tile) => {
      Sounds.battle1.volume = 1;
      Sounds.battle1.play();
      world.Wave(
        new Wave(new RhinocerosBeetle(2), new RhinocerosBeetle(1)).enemies,
        tile
      );
    })
  );
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(stone));
  }

  //row 5
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  /*for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }*/
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map9() {
  //world: World
  let tempmap: Tile[] = [];

  //row1
  tempmap.push(new Tile(stoneWall, false), new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));
  //row2
  tempmap.push(new Tile(stone));
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));
  //row3
  tempmap.push(new Tile(stone), new Tile(stone));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));
  //row4
  tempmap.push(new Tile(stone));
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));

  //row5
  tempmap.push(new Tile(stoneWall, false), new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map10() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i = 0; i < 5; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  return tempmap;
}

export function map11() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i = 0; i < 5; i++) {
    for (let i2 = 0; i2 < 7; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map12() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i = 0; i < 5; i++) {
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map13() {
  //world: World
  let tempmap: Tile[] = [];
  //row 1
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 4; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 2
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stoneWall, false));
  //row 3-4
  for (let i = 0; i < 2; i++) {
    tempmap.push(new Tile(stoneWall, false));
    tempmap.push(new Tile(stone));
    for (let i2 = 0; i2 < 3; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    tempmap.push(new Tile(stone));
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 5
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map14(world: World) {
  let tempmap: Tile[] = [];
  for (let i = 0; i < 3; i++) {
    for (let i2 = 0; i2 < 2; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 4; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(
    new Tile(grass, false, Images.Bee.toSprite(), (tile: Tile) => {
      Sounds.bee.volume = 1;
      Sounds.bee.play();
      let BeeBoss = new Bee(1);
      BeeBoss.on("kill", () => {
        let achv = world.engine.scenes["achievements"] as Achievements;
        achv.getAchievement("Pest control", world.engine.scenes["battle"]);
      });
      world.Wave(
        new Wave(new Grasshopper(2), BeeBoss, new Grasshopper(1)).enemies,
        tile
      );
    })
  );
  for (let i2 = 0; i2 < 3; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i = 0; i < 1; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 5; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map15() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 6; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map16(world: World) {
  let tempmap: Tile[] = [];
  for (let i = 0; i < 4; i++) {
    for (let i2 = 0; i2 < 7; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  tempmap.push(new Tile(stoneWall, false));
  tempmap.push(
    new Tile(stone, false, stoneWall, (tile: Tile) => {
      tile.makeWalkable();
      tile.graphics.layers.get("foreground").hide();
      let achv = world.engine.scenes["achievements"] as Achievements;
      achv.getAchievement("Wall-hugger", world);
    })
  );
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map17() {
  //world: World
  let tempmap: Tile[] = [];
  for (let i2 = 0; i2 < 6; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(new Tile(stoneWall, false));
  for (let i = 0; i < 3; i++) {
    for (let i2 = 0; i2 < 7; i2++) {
      tempmap.push(new Tile(grass));
    }
  }
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map18(world: World) {
  let tempmap: Tile[] = [];
  //row 1
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 2
  for (let i2 = 0; i2 < 6; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 3
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(
    new Tile(grass, false, Images.Button.toSprite(), (t) => {
      t.makeWalkable();
      t.graphics.layers.get("foreground").hide();
      world1Map[8][3].image = stone;
      world1Map[8][3].graphics.use(stone);
      world1Map[8][3].makeWalkable();
      world1Map[8][10].image = stone;
      world1Map[8][10].graphics.use(stone);
      world1Map[8][10].makeWalkable();
      world1Map[8][17].image = stone;
      world1Map[8][17].graphics.use(stone);
      world1Map[8][17].makeWalkable();
      let wr = new writable();
      wr.fcolor = ex.Color.White;
      wr.pos = ex.vec(597, 800);
      world.add(wr);
      wr.Write(
        "A lever (that looks identical to a button) was pressed", //TO DO: draw an actual image for a lever or something
        40,
        50
      );
      wr.actions.delay(3000);
      wr.actions.fade(0, 500);
      wr.actions.die();
    })
  );
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 4
  for (let i2 = 0; i2 < 6; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  //row 5
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map19(world: World) {
  let tempmap: Tile[] = [];
  for (let i = 0; i < 2; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 5; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(grass));
  }
  tempmap.push(
    new Tile(grass, false, new ex.Sprite({ image: Images.Chest }), () => {
      world.engine.goToScene("menu", 3);
    })
  );
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(grass));
  }
  for (let i2 = 0; i2 < 1; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }

  for (let i = 0; i < 1; i++) {
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
    for (let i2 = 0; i2 < 5; i2++) {
      tempmap.push(new Tile(grass));
    }
    for (let i2 = 0; i2 < 1; i2++) {
      tempmap.push(new Tile(stoneWall, false));
    }
  }
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}

export function map20() {
  //world: World
  let tempmap: Tile[] = [];
  return tempmap;
}

export function map21() {
  //world: World
  let tempmap: Tile[] = [];
  tempmap.push(new Tile(stoneWall, false));
  tempmap.push(new Tile(stone));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stoneWall, false));
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stone, false, Images.Chest.toSprite(), () => {}));
  for (let i2 = 0; i2 < 2; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stoneWall, false));
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 5; i2++) {
    tempmap.push(new Tile(stone));
  }
  tempmap.push(new Tile(stoneWall, false));
  for (let i2 = 0; i2 < 7; i2++) {
    tempmap.push(new Tile(stoneWall, false));
  }
  for (let i2 = 0; i2 < 53; i2++) {
    tempmap.push(new Tile(grass));
  }
  return tempmap;
}
