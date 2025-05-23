import * as ex from "excalibur";
import { Images } from "../resources";
import { Enemy } from "./enemy_abstract";
import { damage } from "./damage";
import { Equipment } from "./equipment_abstract";
import { tileSize } from "../maps";

const heroWalkSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.HeroWalk,
  grid: {
    rows: 3,
    columns: 3,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const heroWalkChibiSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.HeroWalkChibi,
  grid: {
    rows: 2,
    columns: 4,
    spriteHeight: 376,
    spriteWidth: 376,
  },
});

const heroDefault = new ex.Sprite({
  image: Images.HeroWalk,
  sourceView: {
    x: 0,
    y: 0,
    width: 376,
    height: 376,
  },
});

const heroChibiDefault = new ex.Sprite({
  image: Images.HeroWalkChibi,
  sourceView: {
    x: 376,
    y: 0,
    width: 376,
    height: 376,
  },
});

const heroChibiRightDefault = new ex.Sprite({
  image: Images.HeroWalkChibi,
  sourceView: {
    x: 0,
    y: 376,
    width: 376,
    height: 376,
  },
});

const heroChibiLeftDefault = new ex.Sprite({
  image: Images.HeroWalkChibi,
  sourceView: {
    x: 376,
    y: 0,
    width: 376,
    height: 376,
  },
});

var stand: ex.Sprite

const animsp = 100;

const walkAnim = ex.Animation.fromSpriteSheet(
  heroWalkSpriteSheet,
  ex.range(0, 8),
  animsp,
  ex.AnimationStrategy.Freeze
);

const walkChibiAnim = ex.Animation.fromSpriteSheet(
  heroWalkChibiSpriteSheet,
  ex.range(0, 3),
  animsp,
  ex.AnimationStrategy.Loop
);

const walkChibiLeftAnim = ex.Animation.fromSpriteSheet(
  heroWalkChibiSpriteSheet,
  ex.range(0, 3),
  animsp,
  ex.AnimationStrategy.Loop
);

const walkChibiRightAnim = ex.Animation.fromSpriteSheet(
  heroWalkChibiSpriteSheet,
  ex.range(4, 7),
  animsp,
  ex.AnimationStrategy.Loop
);

export class PlayerInBattle extends Enemy {
  public sword: Equipment;
  //public armor:Equipment;
  constructor(
    x: number,
    y: number,
    level: number,
    damag: damage,
    sword: Equipment
  ) {
    super({
      pos: new ex.Vector(x, y),
      scale: ex.vec(0.5, 0.5),
    });
    this.level = level;
    this.hp = 200;
    this.def = 30;
    this.attack = 60;
    this.def_magic = 30;
    this.magic = 10;
    this.level = level;
    this.skills = [];
    this.elemental_res = {
      fire: 25,
      water: 25,
      ice: 25,
      wind: 25,
    };
    this.dmg = damag;
    this.target = 1;
    this.sword = sword;
  }

  onInitialize() {
    this.graphics.use(heroDefault);

    //front = hand and held sword
    let front = new ex.Actor({ name: "front" });
    front.graphics.layers.create({
      name: "sword",
      order: -1,
      //offset: ex.vec(0, -30),
    });
    if (this.sword.image != undefined) {
      front.graphics.layers.get("sword").use(this.sword.image);
    }
    front.graphics.use(Images.HeroHand.toSprite());
    front.pos = ex.vec(0, -80); //better position relating to player
    front.graphics.anchor = ex.vec(0.5, 0.3); //correct center of the arm for better rotation
    front.z = 1;
    this.addChild(front);

    this.leveledStats(this.level);
    this.equipStats(this.sword);
  }

  public basicAttack(target: number, enemypos: number) {
    /*const walkAnim = ex.Animation.fromSpriteSheet(
      heroWalkSpriteSheet,
      ex.range(0, 8),
      animsp,
      ex.AnimationStrategy.Freeze
    );*/
    //const enmypos = 317;
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });

    this.actions.easeTo(ex.vec(973 - 75, enemypos), animsp * 8);
    this.actions.delay(50);
    //attack animation (would like to redo in the future)
    this.actions.callMethod(() => {
      //walkAnim.pause();
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].name == "front") {
          //get the actor front (hand and held sword)
          (this.children[i] as ex.Actor).actions.rotateTo(
            (-Math.PI / 180) * 50,
            (Math.PI / 180) * 200
          );
          //(this.children[i] as ex.Actor).graphics.layers.get("sword");
          //(this.children[i] as ex.Actor).actions.delay(500);
          (this.children[i] as ex.Actor).actions.rotateTo(
            0,
            (Math.PI / 180) * 200
          );
        }
      }
    });

    this.actions.delay(250);
    this.actions.callMethod(() => {
      this.dealDamage(10, false, this.sword.element, target);
    });
    this.actions.delay(250);
    this.actions.callMethod(() => {
      this.graphics.use(walkAnim).reset();
    });
    this.actions.easeTo(ex.vec(this.pos.x, this.pos.y), animsp * 8);
    this.actions.callMethod(() => {
      this.graphics.use(heroDefault);
    });
  }

  public block() {
    //currently just gives a 50% defense and magic defense buffs, without animation
    if (Number.isNaN(this.buffs["def"]) || this.buffs["def"] < 50) {
      this.buffs["def"] = 50;
    }
    if (Number.isNaN(this.buffs["defM"]) || this.buffs["defM"] < 50) {
      this.buffs["defM"] = 50;
    }
  }

  public update(engine: ex.Engine, delta: number) {
    //hand animation while walking
    if (walkAnim.isPlaying) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].name == "front") {
          if (walkAnim.currentFrameIndex == 9)
            (this.children[i] as ex.Actor).actions.rotateTo(0, rotateSpeed);
          if (walkAnim.currentFrameIndex == 1)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 7,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 2)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 20,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 3)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 32,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 4)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 20,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 5)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 7,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 6)
            (this.children[i] as ex.Actor).actions.rotateTo(0, rotateSpeed);
          if (walkAnim.currentFrameIndex == 7)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 7,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 8)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 20,
              rotateSpeed
            );
          if (walkAnim.currentFrameIndex == 9)
            (this.children[i] as ex.Actor).actions.rotateTo(
              -(Math.PI / 180) * 7,
              rotateSpeed
            );
        }
      }
    }

    if (this.hp <= 0) {
      this.die();
    }

    //testing purposes!
    if (engine.input.keyboard.wasReleased(ex.Keys.Q)) {
      this.basicAttack(4, 317);
      //console.log(this.dmg.target);
    }

    if (this.dmg.target == this.target) {
      //console.log("target aquired: " + this.dmg.target);
      //this.dmg.last_target = this.dmg.target;
      this.takeDamage(this.dmg.amount, this.dmg.magic, this.dmg.element);
      this.dmg.target = 0;
    }
    super.update(engine, delta);
  }
}

const playerSpeed = 450;
const rotateSpeed = 1000; //((Math.PI / 180) * 1000) / animsp

export class PlayerOutside extends ex.Actor {
  public direction = 0;
  public health = 100;

  constructor() {
    super({
      width: tileSize/2,
      height: tileSize,
      collider: ex.Shape.Box(
        tileSize/2,
        tileSize
        //new ex.Vector(0.5, 0.5),
        //new ex.Vector(0, 4)
      ),
      collisionType: ex.CollisionType.Active,
    });
  }

  onInitialize() {
    stand = heroChibiDefault
    /*let front = new ex.Actor({ name: "front" });
    front.graphics.use(Images.HeroHand.toSprite());
    front.pos = ex.vec(0, -80);
    front.graphics.anchor = ex.vec(0.5, 0.3);
    front.z = 1;
    this.addChild(front);*/
    this.scale=ex.vec(0.25, 0.25)
  }

  public update(engine: ex.Engine, delta: number) {
    //player movement
    this.vel.x = 0;
    this.vel.y = 0;
    if (
      engine.input.keyboard.isHeld(ex.Keys.W) ||
      engine.input.keyboard.isHeld(ex.Keys.Up) ||
      (this.direction == 1)
    ) {
      this.graphics.use(walkChibiAnim);
      stand = heroChibiDefault
      this.vel.y = -1;
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.S) ||
      engine.input.keyboard.isHeld(ex.Keys.Down)||
      (this.direction == 3)
    ) {
      this.graphics.use(walkChibiAnim);
      stand = heroChibiDefault
      this.vel.y = 1;
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.D) ||
      engine.input.keyboard.isHeld(ex.Keys.Right)||
      (this.direction == 4)
    ) {
      this.vel.x = 1;
      this.graphics.use(walkChibiRightAnim)
      stand = heroChibiRightDefault
    }
    if (
      engine.input.keyboard.isHeld(ex.Keys.A) ||
      engine.input.keyboard.isHeld(ex.Keys.Left)||
      (this.direction == 2)
    ) {
      this.vel.x = -1;
      stand = heroChibiLeftDefault
      this.graphics.use(walkChibiLeftAnim)
      
    }
    if (this.vel.x != 0 || this.vel.y != 0) {
      /*if (walkAnim.isPlaying) {
        for (let i = 0; i < this.children.length; i++) {
          if (this.children[i].name == "front") {
            if (walkAnim.currentFrameIndex == 9)
              (this.children[i] as ex.Actor).actions.rotateTo(0, rotateSpeed);
            if (walkAnim.currentFrameIndex == 1)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 7,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 2)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 20,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 3)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 32,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 4)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 20,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 5)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 7,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 6)
              (this.children[i] as ex.Actor).actions.rotateTo(0, rotateSpeed);
            if (walkAnim.currentFrameIndex == 7)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 7,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 8)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 20,
                rotateSpeed
              );
            if (walkAnim.currentFrameIndex == 9)
              (this.children[i] as ex.Actor).actions.rotateTo(
                -(Math.PI / 180) * 7,
                rotateSpeed
              );
          }
        }
      }
      if (walkAnim.done) {
        walkAnim.reset();
      }*/
      this.vel.normalize();
      this.vel.x *= playerSpeed;
      this.vel.y *= playerSpeed;
    } else {

      this.graphics.use(stand);
    }

    super.update(engine, delta);
  }
}
