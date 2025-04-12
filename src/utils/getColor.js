/**
 * Returns a color based on the item ID
 * @param {number} id
 * @returns {string}
 */
export default function getColor(id) {
  const colors = [
    "#cce0ff",
    "#0066ff",
    "#e0ccff",
    "#ffcccc",
    "#d9f2d9",
    "#ffcc99",
    "#ccffff",
    "#ffb3e6",
  ];
  return colors[id % colors.length];
}
