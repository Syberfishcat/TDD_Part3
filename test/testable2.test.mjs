import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/testable2.mjs";

function rollsOf(...values) {
  const queue = [...values];
  return () => queue.shift();
}

describe("Testable 2: a dice game", () => {
  test("a pair of ones scores 101", () => {
    expect(diceHandValue(rollsOf(1, 1))).to.equal(101);
  });

  test("a pair of sixes scores 106", () => {
    expect(diceHandValue(rollsOf(6, 6))).to.equal(106);
  });

  test("two different dice score the higher die", () => {
    expect(diceHandValue(rollsOf(2, 5))).to.equal(5);
  });

  test("order of the two dice does not matter", () => {
    expect(diceHandValue(rollsOf(5, 2))).to.equal(5);
  });
});
