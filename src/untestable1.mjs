// Why this is hard to test:
// - Hidden dependency on the system clock via `new Date()` (an untestable singleton).
// - The function takes no arguments, yet returns a different value every day,
//   so the same test can pass today and fail tomorrow.
// - Boundary cases (Dec 24, Dec 25, Dec 26, leap years, year wrap-around) are
//   impossible to exercise without time-travel or mocking the global clock.
// Fix (see testable1.mjs): inject "today" as a parameter so the core logic
// becomes a pure function of its inputs.

const millisPerDay = 24 * 60 * 60 * 1000;

export function daysUntilChristmas() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
