import * as ex from "excalibur";
import { PlayerInBattle, PlayerOutside } from "../actors/hero";
import { Sounds } from "../resources";
import { Enemy } from "../actors/enemy_abstract";
import { damage } from "../actors/damage";
import { Difficulty } from "./difficulty";
import { Button } from "../actors/buttons/button_abstract";
import { Achievements } from "./achievements";
import * as world1 from "../maps";
import { Equipment } from "../actors/equipment_abstract";
import { swordBaton } from "../actors/swords";

//used for easier enemie placement(gives the certain coordinates for the enemy)
//might be implemented in Tile object in the future
//coordinates formula:
//x = (2388-(2388%376)/2-376)*scale
//y = ((1668%376)/2+376*enemy[0,1,2])*scale

//const sidemove = (2388-world1.tileSize*11);
//const upmove = (1668-world1.tileSize*8);
var waveInAction: boolean = false;

export class Wave {
  public enemies: Enemy[] = [];
  loc = 317; //y coordinate of the first enemy
  constructor(enemy1?: Enemy, enemy2?: Enemy, enemy3?: Enemy) {
    if (enemy1 != undefined) {
      enemy1.pos = ex.vec(973, this.loc);
      enemy1.z = 2;
      this.enemies.push(enemy1);
    }
    if (enemy2 != undefined) {
      enemy2.pos = ex.vec(973, this.loc + 188);
      enemy2.z = 2;
      this.enemies.push(enemy2);
    }
    if (enemy3 != undefined) {
      enemy3.pos = ex.vec(973, this.loc + 376);
      enemy3.z = 2;
      this.enemies.push(enemy3);
    }
  }
}

//a tile is a 376*376 pixels square, that is either a walkable through background or an unwalkable obstacle(wall, enemy, chest, diary with text)
export class Tile extends ex.Actor {
  image?: ex.Sprite;
  constructor(
    image?: ex.Sprite,
    walkable?: boolean, //default: walkable
    image2?: ex.Sprite, //optional front sprite
    method?: (t: Tile) => any //method activated on collision
  ) {
    var config: ex.ActorArgs = {};
    if (walkable != undefined) {
      //only add collision if not walkable
      if (!walkable) {
        config.height = world1.tileSize;
        config.width = world1.tileSize;
        config.collisionType = ex.CollisionType.Fixed;
        config.collider = ex.Shape.Box(world1.tileSize, world1.tileSize, ex.Vector.Zero);
      }
    }
    super(config);
    //adds an optional front sprite
    if (image2 != undefined) {
      image2.scale = ex.vec(world1.tileSize/376, world1.tileSize/376)
      this.graphics.layers.create({
        name: "foreground",
        order: 1,
      });
      this.graphics.layers.get("foreground").use(image2);
    }
    //adds a method activated on collision(if the tile is not walkable)
    if (method != undefined) {
      this.on("collisionstart", () => {
        method(this);
      });
    }
    this.scale = ex.vec(0.5, 0.5);
    this.image = image;
    this.z = -1;
  }

  onInitialize(_engine: ex.Engine): void {
    this.graphics.anchor = ex.Vector.Zero;
    if (this.image != undefined) {
      this.graphics.use(this.image);
    }
  }

  public makeWalkable() {
    this.collider.clear();
  }
}

export class World extends ex.Scene {
  public hero: PlayerOutside = new PlayerOutside();
  public roomx: number = 1;
  public roomy: number = 1;

  public xp: number = 0;
  public level: number = 1;
  public sword: Equipment = swordBaton;

  public pb: number = 0;

  public map: Tile[] = [];
  public worldMap: Tile[][] = [];
  public lastWave?: Tile;

  public direction: number = 0;

  onInitialize(_engine: ex.Engine): void {
    //generates the world map
    this.WorldGenerator();
    //loads current map
    this.loadMap();
    this.hero.pos = ex.vec(1040, 360);
    this.add(this.hero);
    var stats = new Button(100, 50, true, 0.5, 60, "Stats", () => {
      _engine.goToScene("stats", [this.level, this.xp]);
    });
    this.add(stats);
    var medals = new Button(288, 50, true, 0.5, 60, "Medals", () => {
      _engine.goToScene("achievements", 2);
    });
    this.add(medals);

    var w = new Button(288, 674, false, 0.5, 60, "^", () => {
      this.direction = 0;
    });
    w.on("pointerdown", ()=>{
      this.direction = 1;
    })
    this.add(w);
    var a = new Button(100, 724, false, 0.5, 60, "<", () => {
      this.direction = 0;
    });
    a.on("pointerdown", ()=>{
      this.direction = 2;
    })
    this.add(a);
    var s = new Button(288, 724, false, 0.5, 60, "v", () => {
      this.direction = 0;
    });
    s.on("pointerdown", ()=>{
      this.direction = 3;
    })
    this.add(s);
    var d = new Button(288+188, 724, false, 0.5, 60, ">", () => {
      this.direction = 0;
    });
    d.on("pointerdown", ()=>{
      this.direction = 4;
    })
    this.add(d);
  }

  onPostUpdate(_engine: ex.Engine, _delta: number): void {
    this.hero.direction=this.direction;
    //if player is outside game screen coordinates -> move him to the next "room"
    //"room" is a 5(height)*7(width) tiles large map
    if (this.hero.pos.x > 1194) {
      this.roomx++;
      this.loadMap();
      this.hero.pos.x = 0;
    }
    if (this.hero.pos.x < 0) {
      this.roomx--;
      this.loadMap();
      this.hero.pos.x = 1194;
    }
    if (this.hero.pos.y > 834) {
      this.roomy++;
      this.loadMap();
      this.hero.pos.y = 0;
    }
    if (this.hero.pos.y < 0) {
      this.roomy--;
      this.loadMap();
      this.hero.pos.y = 834;
    }
  }

  onActivate(_context: ex.SceneActivationContext<unknown>): void {
    Sounds.world1.volume = 1;
    if (!Sounds.world1.isPlaying()) {
      Sounds.world1.play();
      Sounds.world1.seek(this.pb);
    }
    if (_context.data != null) {
      if ((_context.data as number[])[0] == 2) {
        this.xp = (_context.data as number[])[1];
        this.level = (_context.data as number[])[2];
        if (this.lastWave != undefined) {
          this.lastWave.graphics.layers.get("foreground").hide();
          this.lastWave.makeWalkable();
        }
      }
      if ((_context.data as number[])[0] == 0) {
        let achv = this.engine.scenes["achievements"] as Achievements;
        achv.getAchievement("Leg day", this);
      }
    }
    waveInAction = false;
  }


  
  //if tiles were already created unkills them, otherwise creates new and adds to the scene/world/game
  public createMap() {
    let height = 5; //8
    let width = 7; //11
    for (let i = 0; i < height; i++) {
      //row
      for (let i2 = 0; i2 < width; i2++) {
        //collum
        if (this.map[i * width + i2].isKilled()) {
          this.map[i * width + i2].unkill();
          this.add(this.map[i * width + i2]);
        } else {
          this.map[i * width + i2].pos = ex.vec(i2 * world1.tileSize/2, i * world1.tileSize/2);
          this.add(this.map[i * width + i2]);
        }
      }
    }
  }

  //kills all the tiles on the last used map
  public clearMap() {
    for (let i = this.map.length - 1; i >= 0; i--) {
      this.map[i].kill();
    }
  }

  public WorldGenerator() {
    //        comments from the maps.ts file:
    //world builder; probably looks messy and is that way;
    //divides the worldmap into smaller maps - "rooms"(5(height)*7(width) tiles large map) and fills them with according tiles
    this.worldMap = world1.WorldGenerator(this);
  }

  //loads current map by deleting previous(if any) and filling all the tiles
  public loadMap() {
    this.clearMap();
    this.map = this.worldMap[this.roomx + this.roomy * 5];
    this.createMap();
  }

  //starts a battle, might consider moving this method to the Tile object again
  public Wave(enemyArray: Enemy[], tile: Tile) {
    if (waveInAction){
      return;
    }
    waveInAction = true;
    Sounds.world1.volume = 0.75;

    let heroAndEnemyArray: Enemy[] = [];
    let allTheDamage = new damage();
    const loc = 317;
    const hero = new PlayerInBattle(200, loc, 1, allTheDamage, this.sword);
    heroAndEnemyArray.push(hero);
    hero.xp = this.xp;
    hero.level = this.level;
    for (let i = 0; i < enemyArray.length; i++) {
      enemyArray[i].dmg = allTheDamage;
      enemyArray[i].target = 4 + i;
      heroAndEnemyArray.push(enemyArray[i]);
    }
    //nightmare difficulty => all enemies have their demonic version
    if ((this.engine.scenes["diff"] as Difficulty).difficulty == 1) {
      for (let i = 0; i < heroAndEnemyArray.length; i++) {
        heroAndEnemyArray[i].demonic = true;
      }
    }
    //the tile that should be edited if the battle is won
    this.lastWave = tile;

    //black fading screen before the start of the battle, and music becomes gradually quieter
    const canvas = new ex.Canvas({
      width: 1194,
      height: 834,
      opacity: 1,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 1194, 834);
      },
    });
    let canva = new ex.Actor();
    canva.graphics.use(canvas);
    canva.graphics.anchor = ex.Vector.Zero;
    canva.z = 100;
    canva.graphics.opacity = 0;
    this.add(canva);
    canva.actions.fade(1, 1500);
    tile.actions.delay(500);
    tile.actions.callMethod(() => {
      Sounds.world1.volume = 0.5;
    });
    tile.actions.delay(500);
    tile.actions.callMethod(() => {
      Sounds.world1.volume = 0.25;
    });
    tile.actions.delay(500);
    tile.actions.callMethod(() => {
      this.pb = Sounds.world1.getPlaybackPosition();
      for (let i = 0; i < Sounds.world1.instanceCount(); i++) {
        Sounds.world1.instances[i].stop();
        Sounds.world1.instances[i].volume = 0;
      }
      canva.kill();
      this.engine.goToScene("battle", heroAndEnemyArray);
    });
  }
}
