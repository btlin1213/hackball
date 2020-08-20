const _ = require("lodash");
const { Circle, Vec2 } = require("./math");

const PACK = {
  x: 0,
  y: 1,
  r: 2,
  type: 3,
};

// x, y, r, 0b___btt
const SIZE = 6;
class Entity {
  constructor(circle, v, type = Entity.TYPES.PLAYER) {
    this.circle = circle;
    this.v = v || new Vec2();
    this.type = type;
    this.arraySize = SIZE;
    this.init();
  }
  init() {}
  toArray() {
    const array = new Float32Array(this.arraySize);
    array.fill(0);
    array.set([this.circle.x, this.circle.y, this.circle.r, this.type]);
    return array;
  }
}

Entity.TYPES = {
  PLAYER: 0,
  BALL: 1,
};

class Player extends Entity {
  constructor(circle, v) {
    super(circle, v, Entity.TYPES.PLAYER);
  }
  init() {
    this.moving = false;
    this.hasBall = false;
    this.ballId = null;
    this.pickUp = false;
    this.throw = false;
    this.aimDirection = new Vec2(1, 0);
  }
}

class Ball extends Entity {
  constructor(circle, id, v) {
    super(circle, v, Entity.TYPES.PLAYER);
    this.id = id;
  }
  init() {
    this.pickedUp = false;
    this.moving = false;
    this.team = null;
  }
}

function entityFromArray(array) {
  const x = array[PACK.x];
  const y = array[PACK.y];
  const r = array[PACK.r];
  const type = array[PACK.type];
  if (type == Entity.TYPES.PLAYER) {
    return new Player(new Circle(x, y, r), null);
  }
  if (type == Entity.TYPES.BALL) {
    return new Ball(new Circle(x, y, r), null);
  }
  throw "Type not found";
}

function entitiesFromArray(array) {
  const entityArrays = _.chunk(array, SIZE);
  return entityArrays.map(entityFromArray);
}

console.log(entitiesFromArray([1, 2, 3, 0, 5, 6]));
