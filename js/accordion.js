// js/accordion.js
export function nextAccordionIndex(currentOpen, clickedIndex) {
  return currentOpen === clickedIndex ? null : clickedIndex;
}
