/**
 * Formats a date to YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export default function formatDate(date) {
  return date.toISOString().split("T")[0];
}
