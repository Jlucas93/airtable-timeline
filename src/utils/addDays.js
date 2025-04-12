import formatDate from "./formatDate";

/**
 * Add days to a date
 * @param {string} dateStr
 * @param {number} days
 * @returns {string}
 */
export default function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}
