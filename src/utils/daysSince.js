/**
 * Converts a date in YYYY-MM-DD format to the number of days since the base date.
 * @param {string} dateStr
 * @param {Date} baseDate
 * @returns {number}
 */
export default function daysSince(dateStr, baseDate) {
  const date = new Date(dateStr);
  const diff = date - baseDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
