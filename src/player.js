export default class Player {
  constructor(name, gameBoard) {
    this.name = name;
    this.gameBoard = gameBoard;
  }

  placeShip(ship, startPos, horizontal = false) {
    this.gameBoard.placeShip(ship, startPos, (horizontal = false));
  }

  receiveAttack(coords) {
    this.gameBoard.receiveAttack(coords);
  }

  allShipsSunk() {
    return this.gameBoard.allShipsSunk();
  }
}
