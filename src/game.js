import Ship from "./ship";
import Gameboard from "./gameboard";
import ComputerPlayer from "./computerPlayer";

export default class Game {
  computerBoard = new Gameboard();
  playerBoard = new Gameboard();
}
