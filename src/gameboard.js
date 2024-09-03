import Ship from "./ship";

export default class GameBoard {
  constructor() {
    this.board = Array(10)
      .fill(null)
      .map(() => Array(10).fill(null));

    this.missedShots = [];
    this.attackedPos = new Set();
    this.ships = [];
  }

  receiveAttack(coords) {
    const [row, col] = coords;
    const key = `${row},${col}`;

    if (this.attackedPos.has(key)) return;

    this.attackedPos.add(key);
    if (this.board[row][col] !== null) {
      this.board[row][col].hit();
    } else {
      this.missedShots.push(coords);
    }
  }

  placeShip(ship, startPos, horizontal = false) {
    const [row, col] = startPos;

    if (horizontal) {
      if (col + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row][col + i] !== null) return false;
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[row][col + i] = ship;
      }
    }

    if (!horizontal) {
      if (row + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (this.board[row + i][col] !== null) return false;
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[row + i][col] = ship;
      }
    }

    this.ships.push(ship);
    return true;
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
