import Gameboard from "../gameboard";
import Ship from "../ship";

describe("Game Board functions", () => {
  let gameBoard;
  let ship1;
  let ship2;

  beforeEach(() => {
    gameBoard = new Gameboard();
    ship1 = new Ship("Carrier", 5);
    ship2 = new Ship("Submarine", 3);
  });

  test("Place ship - vertical", () => {
    gameBoard.placeShip(ship1, [0, 0]);
    expect(gameBoard.board[0][0]).toBe(ship1);
    expect(gameBoard.board[1][0]).toBe(ship1);
    expect(gameBoard.board[2][0]).toBe(ship1);
    expect(gameBoard.board[3][0]).toBe(ship1);
    expect(gameBoard.board[4][0]).toBe(ship1);
    expect(gameBoard.board[5][0]).toBe(null);
    expect(gameBoard.board[0][1]).toBe(null);
  });

  test("Place ship - horizontal", () => {
    gameBoard.placeShip(ship1, [0, 0], true);

    expect(gameBoard.board[0][0]).toBe(ship1);
    expect(gameBoard.board[0][1]).toBe(ship1);
    expect(gameBoard.board[0][2]).toBe(ship1);
    expect(gameBoard.board[0][3]).toBe(ship1);
    expect(gameBoard.board[0][4]).toBe(ship1);
    expect(gameBoard.board[0][5]).toBe(null);
    expect(gameBoard.board[1][0]).toBe(null);
  });

  test("Record hit on ship", () => {
    gameBoard.placeShip(ship1, [0, 0], true);
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([0, 1]);
    gameBoard.receiveAttack([7, 0]);
    expect(ship1.hits).toBe(2);
  });

  test("Sink ship when full of hits", () => {
    gameBoard.placeShip(ship1, [3, 0]);
    gameBoard.receiveAttack([3, 0]);
    gameBoard.receiveAttack([4, 0]);
    gameBoard.receiveAttack([5, 0]);
    gameBoard.receiveAttack([6, 0]);
    gameBoard.receiveAttack([7, 0]);
    expect(ship1.isSunk()).toBe(true);
  });

  test("Record missed shots", () => {
    gameBoard.receiveAttack([0, 8]);
    expect(gameBoard.missedShots).toContainEqual([0, 8]);
  });

  test("Not increase n° of hits if same pos", () => {
    gameBoard.placeShip(ship1, [0, 4], true);
    gameBoard.receiveAttack([0, 5]);
    gameBoard.receiveAttack([0, 5]);
    gameBoard.receiveAttack([0, 5]);
    expect(ship1.hits).toBe(1);
  });

  test("Not sunk ship if partially hit", () => {
    gameBoard.placeShip(ship1, [3, 0]);
    gameBoard.receiveAttack([3, 0]);
    gameBoard.receiveAttack([4, 0]);
    // gameBoard.receiveAttack([5, 0]);
    gameBoard.receiveAttack([6, 0]);
    gameBoard.receiveAttack([7, 0]);
    expect(ship1.isSunk()).toBe(false);
  });

  test("Check if all ships are sunk", () => {
    gameBoard.placeShip(ship1, [0, 0]);
    gameBoard.placeShip(ship2, [0, 5], true);
    // Ship 1
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([1, 0]);
    gameBoard.receiveAttack([2, 0]);
    gameBoard.receiveAttack([3, 0]);
    gameBoard.receiveAttack([4, 0]);
    // Ship 2
    gameBoard.receiveAttack([0, 5]);
    gameBoard.receiveAttack([0, 6]);
    gameBoard.receiveAttack([0, 7]);

    expect(gameBoard.allShipsSunk()).toBe(true);
  });

  test("Check if all ships are not sunk", () => {
    gameBoard.placeShip(ship1, [0, 0]);
    gameBoard.placeShip(ship2, [0, 5], true);
    // Ship 1
    gameBoard.receiveAttack([0, 0]);
    gameBoard.receiveAttack([1, 0]);
    gameBoard.receiveAttack([2, 0]);
    gameBoard.receiveAttack([3, 0]);
    gameBoard.receiveAttack([4, 0]);
    // Ship 2 not sunk

    expect(gameBoard.allShipsSunk()).toBe(false);
  });

  test("Not placing when already a ship in place", () => {
    gameBoard.placeShip(ship1, [0, 0]);
    gameBoard.placeShip(ship2, [0, 0]);

    expect(gameBoard.board[0][0]).toBe(ship1);
  });
});
