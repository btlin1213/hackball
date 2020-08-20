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
  toArray() {
    const array = super.toArray();
    const encoded = encodeBoolArray([
      this.moving,
      this.hadBall,
      this.pickUp,
      this.throw,
    ]);
    array.set(encoded, PACK.type + 1);
  }
}

// class Civilian extends Player {
//   constructor() {
//     super(room, circle, v, type=BoardBody.TYPES.PLAYER);
//     this.pickedUpCorona = false;
//     this.caughtCorona = false;
//     this.wearingMask = false;
//     this.speed = 1;
//   }

//   /**
//    * attach coronavirus to player
//    * @param {BoardBody} ball
//    */
//   _pickupCorona(ball) {
//     // to be implemented
//   }

//   /**
//    * throws coronavirus at target position coord
//    * @param {Vec2} targetPosition
//    */
//   _throwCorona(targetPosition) {
//     // to be implemented
//   }
// }

// class Medic extends BoardBody {
//   constructor() {
//     super(room, circle, v, type=BoardBody.TYPES.PLAYER);
//     this.pickedUpCorona = false;
//     this.caughtCorona = false;
//     this.wearingMask = false;
//     this.curingPlayer = false;
//     this.speed = 1;
//   }
//   /**
//    * attach coronavirus to player
//    * @param {BoardBody} ball
//    */
//   _pickupCorona(ball) {
//     // to be implemented
//   }

//   /**
//    * throws coronavirus at target position coord
//    * @param {Vec2} targetPosition
//    */
//   _throwCorona(targetPosition) {
//     // to be implemented
//   }

//   /**
//    *
//    * @param {BoardBody} player
//    * @returns {BoardBody} player with wearingMask set to true
//    */
//   _curingPlayer(player) {
//     // to be implemented

//     // player.wearingMask = true;
//     // return player;
//   }
// }

// class Jacinda extends BoardBody {
//   constructor() {
//     super(room, circle, v, BoardBody.TYPES.PLAYER);
//     this.caughtCorona = false;
//     this.wearingMask = false;
//     this.inParliament = false;
//     this.speed = 1.5;
//   }
// }

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

function encodeBoolArray(bools, size = 8, maxlen = Infinity) {
  const encodedLength = Math.ceil(bools.length / size);
  if (encodedLength > maxlen)
    throw "Encoded boolean array exceeds the maximum length";
  const encoded = new Array(encodedLength).fill(0);
  bools.forEach((x, i) => {
    var offset = i % size;
    var idx = Math.floor(i / size);
    encoded[idx] = encoded[idx] | (x << offset);
  });
  return encoded;
}

function decodeNumArray(nums, length, size = 8) {
  if (nums.length * size < length)
    throw "Expected number of booleans is larger than the decoded numbers array";
  const bools = [];
  for (var i = 0; i < length; i++) {
    var idx = Math.floor(i / size);
    var offset = i % size;
    var bool = (nums[idx] & (1 << offset)) != 0;
    bools.push(bool);
  }
  return bools;
}

// console.log(entitiesFromArray([1, 2, 3, 0, 5, 6]));
// const nums = encodeBoolArray([
//   true,
//   false,
//   true,
//   true,
//   true,
//   false,
//   false,
//   false,
//   true,
// ]);
// console.log(nums);
// const decoded = decodeNumArray(nums, 9);
// console.log(decoded);
