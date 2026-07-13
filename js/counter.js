// js/counter.js
export function countUpValue(elapsed, duration, start, end) {
  const t = Math.min(Math.max(elapsed / duration, 0), 1);
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(start + (end - start) * eased);
}
