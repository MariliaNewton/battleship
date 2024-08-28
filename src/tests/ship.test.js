import Ship from "../ship";

describe("Ship functions", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship("Carrier", 5);
  });

  test("Check if sunk", () => {
    for (let i = 0; i < ship.length; i++) {
      ship.hit();
    }

    expect(ship.isSunk()).toBe(true);
  });

  test("Check if not sunk", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test("Numbers of hits", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(3);
  });
});
