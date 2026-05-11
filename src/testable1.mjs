const millisPerDay = 24 * 60 * 60 * 1000;

export function daysUntilChristmas(today = new Date()) {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const christmasDay = new Date(today.getFullYear(), 12 - 1, 25);
  if (startOfToday.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(today.getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - startOfToday.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
