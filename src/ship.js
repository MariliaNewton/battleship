export default class Ship {
  constructor(name, length, img = "", hits = 0) {
    this.name = name;
    this.length = length;
    this.hits = hits;
    this.img = img;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
