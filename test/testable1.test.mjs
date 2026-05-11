import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("Testable 1: days until Christmas", () => {
  test("a normal day in the year", () => {
    expect(daysUntilChristmas(new Date(2024, 0, 1))).to.equal(359);
  });

  test("the day before Christmas is 1 day away", () => {
    expect(daysUntilChristmas(new Date(2024, 11, 24))).to.equal(1);
  });

  test("Christmas day itself is 0 days away", () => {
    expect(daysUntilChristmas(new Date(2024, 11, 25))).to.equal(0);
  });

  test("the day after Christmas counts toward next year's Christmas", () => {
    expect(daysUntilChristmas(new Date(2024, 11, 26))).to.equal(364);
  });

  test("December 26 in a year before a leap year accounts for the extra day", () => {
    // 2023-12-26 -> 2024-12-25 spans Feb 29, 2024
    expect(daysUntilChristmas(new Date(2023, 11, 26))).to.equal(365);
  });

  test("ignores the time of day", () => {
    const morning = new Date(2024, 11, 24, 0, 0, 0);
    const evening = new Date(2024, 11, 24, 23, 59, 59);
    expect(daysUntilChristmas(morning)).to.equal(daysUntilChristmas(evening));
  });
});
