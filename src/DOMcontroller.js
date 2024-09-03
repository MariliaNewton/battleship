import Ship from "./ship";
import Gameboard from "./gameboard";
import ComputerPlayer from "./computerPlayer";
import water from "./assets/images/water.png";
import fire from "./assets/images/fire.png";
import carrier from "./assets/images/ship-5.png";
import battleship from "./assets/images/ship-4.png";
import cruiser from "./assets/images/ship-3.png";
import submarine from "./assets/images/ship-3-2.png";
import destroyer from "./assets/images/ship-2.png";

const playerBoardEl = document.querySelector(".board-player");
const computerBoardEl = document.querySelector(".board-computer");
const btnStartGame = document.querySelector(".btn-start");
const btnExitGame = document.querySelector(".btn-exit");
const btnPlayAgain = document.querySelector(".btn-play-again");
const squares = document.querySelectorAll(".square");

const shipParking = document.querySelector(".ship-parking");
const shipsParked = document.querySelectorAll(".parked");
const announceBoard = document.querySelector(".announcement");
const lightComputer = document.querySelector(".green-light-computer");
const lightPlayer = document.querySelector(".green-light-player");
const winnerSign = document.querySelector(".winner");
const gameOverPopUp = document.querySelector(".play-again");
const body = document.querySelector("body");

// Not sure if needed
const carrierShip = document.querySelector(".carrier");
const battleshipShip = document.querySelector(".battleship");
const cruiserShip = document.querySelector(".cruiser");
const submarineShip = document.querySelector(".submarine");
const destroyerShip = document.querySelector(".destroyer");

export default class DOMcontroller {
  computerBoard = new Gameboard();
  playerBoard = new Gameboard();
  computerPlayer = new ComputerPlayer();
  playerPlaced = false;
  computerPlaced = false;
  shipSelected = "";
  winner = "";
  onGame = false;

  init() {
    this.placeCompShips();

    btnStartGame.addEventListener("click", () => {
      if (!this.playerPlaced || !this.computerPlaced) return;

      btnStartGame.classList.toggle("unclickable");
      this.changeAnnounce("Attack !!!");
      lightPlayer.classList.add("active");

      this.onGame = true;
    });

    shipParking.addEventListener("click", (e) => {
      if (e.target.classList.contains("taken")) return;
      this.shipSelected = e.target;
      playerBoardEl.classList.add("active");
    });

    playerBoardEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("square")) return;
      if (this.shipSelected === "") return;

      const ship = new Ship(
        this.shipSelected.classList[0],
        +this.shipSelected.dataset.length
      );

      const row = +e.target.dataset.row;
      const col = +e.target.dataset.col;

      if (!this.playerBoard.placeShip(ship, [row, col])) return;

      const imgShip = this.shipSelected.cloneNode(true);
      imgShip.classList.remove("parked");
      e.target.appendChild(imgShip);

      playerBoardEl.classList.remove("active");
      this.shipSelected.classList.add("taken");
      this.shipSelected = "";

      this.playerPlaced = Array.from(shipsParked).every((ship) =>
        ship.classList.contains("taken")
      );

      if (this.playerPlaced) this.releaseGame();
    });

    computerBoardEl.addEventListener("click", (e) => {
      if (!this.onGame) return;
      if (!e.target.classList.contains("square")) return;

      const coords = [e.target.dataset.row, e.target.dataset.col];

      this.computerBoard.receiveAttack(coords);

      this.updateBoard(this.computerBoard, computerBoardEl);

      this.revelIfSunk(this.computerBoard, computerBoardEl);

      this.toggleGreenLight();

      this.changeAnnounce("Enemy attack");

      this.playerBoard.receiveAttack(this.makeMove(this.playerBoard));

      setTimeout(() => {
        this.updateBoard(this.playerBoard, playerBoardEl);

        setTimeout(() => {
          this.toggleGreenLight();

          this.changeAnnounce("Attack !!!");

          this.checkForWinner();
        }, 1000);
      }, 1000);
    });

    btnPlayAgain.addEventListener("click", () => {
      this.restartVariables();

      body.classList.remove("blurred");
      gameOverPopUp.classList.remove("visible");
      btnExitGame.classList.remove("unclickable");

      this.changeAnnounce("Place Ships!");

      squares.forEach((sq) => {
        sq.innerHTML = "";
      });

      shipsParked.forEach((ship) => {
        ship.classList.remove("taken");
      });

      this.placeCompShips();
    });
  }

  restartVariables() {
    this.computerBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    this.computerPlayer = new ComputerPlayer();
    this.playerPlaced = false;
    this.computerPlaced = false;
    this.shipSelected = "";
    this.winner = "";
    this.onGame = false;
  }

  releaseGame() {
    this.changeAnnounce("Start Game!");
    btnStartGame.classList.toggle("unclickable");
  }

  changeAnnounce(text) {
    announceBoard.textContent = text;
  }

  placeCompShips() {
    [
      new Ship("carrier", 5, carrier),
      new Ship("battleship", 4, battleship),
      new Ship("cruiser", 3, cruiser),
      new Ship("submarine", 3, submarine),
      new Ship("destroyer", 2, destroyer),
    ].forEach((ship) => {
      let placed = false;
      while (!placed) {
        const horizontal = Math.random() > 0.5 ? true : false;
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        placed = this.computerBoard.placeShip(ship, [row, col], horizontal);

        if (placed) this.attachShipImgComputer(ship, horizontal, row, col);
      }

      this.computerPlaced = true;
    });
  }

  attachShipImgComputer(ship, horizontal, row, col) {
    const newShipImg = document.createElement("img");

    newShipImg.src = ship.img;
    newShipImg.classList.add(`${ship.name}`);
    newShipImg.classList.add("not-visible");

    if (horizontal) newShipImg.classList.add("horizontal");

    const sq = computerBoardEl.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );

    sq.appendChild(newShipImg);
  }

  updateBoard(board, boardElement) {
    const position = Array.from(board.attackedPos).pop();
    let [row, , col] = position;
    let sq = boardElement.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    const newImg = document.createElement("img");

    if (board.board[row][col] === null) {
      newImg.src = water;
    } else {
      newImg.src = fire;
    }
    newImg.classList.add("shot");
    sq.appendChild(newImg);
  }

  revelIfSunk(board, boardEl) {
    board.ships.forEach((ship) => {
      if (ship.isSunk()) {
        const shipImg = boardEl.querySelector(`.${ship.name}`);
        shipImg.classList.remove("not-visible");
      }
    });
  }

  checkForWinner() {
    let winner = "";
    if (this.computerBoard.ships.every((ship) => ship.isSunk()))
      winner = "Player";
    if (this.playerBoard.ships.every((ship) => ship.isSunk()))
      winner = "Computer";

    if (winner === "") return;

    this.onGame = false;
    this.changeAnnounce("Game over");
    lightComputer.classList.remove("active");
    lightPlayer.classList.remove("active");
    btnStartGame.classList.add("unclickable");
    btnExitGame.classList.add("unclickable");
    winnerSign.textContent = winner === "Player" ? "You won!" : "You lost :(";
    body.classList.add("blurred");
    gameOverPopUp.classList.add("visible");
  }

  toggleGreenLight() {
    lightComputer.classList.toggle("active");
    lightPlayer.classList.toggle("active");
  }

  makeMove(enemyBoard) {
    let row;
    let col;
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
    while (enemyBoard.attackedPos.has(`${row},${col}`)) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }
    return [row, col];
  }
}
