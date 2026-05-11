// Why this is hard to test:
// - Hidden dependency on the global RNG via Math.random() (an untestable singleton).
// - diceHandValue() takes no arguments and returns a different value every call,
//   so we cannot assert specific outcomes like "two 5s should score 105".
// - diceRoll() is a private module function; callers have no way to replace it.
// Fix (see testable2.mjs): inject the roll function as a parameter so the
// scoring logic becomes a pure function of its inputs.

function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}
