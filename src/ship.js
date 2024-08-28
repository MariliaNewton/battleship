export default class Ship {
  constructor(name, length, hits = 0) {
    this.name = name;
    this.length = length;
    this.hits = hits;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
