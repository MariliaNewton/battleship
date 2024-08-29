import Player from "./player";

export default class ComputerPlayer extends Player {
  constructor(name, gameBoard) {
    super(name, gameBoard);
  }

  makeMove() {
    let row;
    let col;
    while (this.gameBoard.attackedPositions.has(`${row},${col}`)) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }
    return [row, col];
  }
}
