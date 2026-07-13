// js/nav.js
export function computeNavState(scrollY, threshold = 40) {
  return scrollY > threshold ? 'condensed' : 'default';
}
