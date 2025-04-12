/**
 * Generates a list of dates to display on the timeline
 * @param {Date} startDate
 * @param {number} numDays
 * @returns {Object}
 */
export default function generateDates(startDate, numDays) {
  const dates = [];
  const months = {};

  for (let i = 0; i < numDays; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const monthKey = `${current.getFullYear()}-${current.getMonth()}`;

    if (!months[monthKey]) {
      months[monthKey] = {
        key: monthKey,
        month: current.toLocaleDateString("en-US", { month: "long" }),
        year: current.getFullYear(),
        startIndex: i,
        count: 1,
      };
    } else {
      months[monthKey].count++;
    }

    dates.push({
      date: current,
      formatted: current.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      dayName: current.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: current.getDate(),
      isWeekend: [0, 6].includes(current.getDay()),
      monthKey: monthKey,
    });
  }

  return { dates, months: Object.values(months) };
}
