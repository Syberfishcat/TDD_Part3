import { describe, test } from "vitest";
import { expect } from "chai";
import { parsePeople } from "../src/testable3.mjs";

describe("Testable 3: CSV parsing", () => {
  test("parses a single row with all fields", () => {
    expect(parsePeople("Anya,Forger,6,Female")).to.deep.equal([
      { firstName: "Anya", lastName: "Forger", age: 6, gender: "f" },
    ]);
  });

  test("omits age when the field is empty", () => {
    expect(parsePeople("Loid,Forger,,Male")).to.deep.equal([
      { firstName: "Loid", lastName: "Forger", gender: "m" },
    ]);
  });

  test("normalizes gender to a lowercase first letter", () => {
    const [a, b, c] = parsePeople("A,A,1,Male\nB,B,1,female\nC,C,1,X");
    expect(a.gender).to.equal("m");
    expect(b.gender).to.equal("f");
    expect(c.gender).to.equal("x");
  });

  test("parses multiple rows", () => {
    const csv = "Loid,Forger,,Male\nAnya,Forger,6,Female\nYor,Forger,27,Female";
    expect(parsePeople(csv)).to.deep.equal([
      { firstName: "Loid", lastName: "Forger", gender: "m" },
      { firstName: "Anya", lastName: "Forger", age: 6, gender: "f" },
      { firstName: "Yor", lastName: "Forger", age: 27, gender: "f" },
    ]);
  });

  test("skips empty lines and trims whitespace", () => {
    const csv = "\n  Anya , Forger , 6 , Female \n\n";
    expect(parsePeople(csv)).to.deep.equal([
      { firstName: "Anya", lastName: "Forger", age: 6, gender: "f" },
    ]);
  });

  test("returns an empty array for empty input", () => {
    expect(parsePeople("")).to.deep.equal([]);
  });
});
