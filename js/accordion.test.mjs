// js/accordion.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextAccordionIndex } from './accordion.js';

test('opens a closed item', () => {
  assert.equal(nextAccordionIndex(null, 2), 2);
});

test('closes the currently open item when clicked again', () => {
  assert.equal(nextAccordionIndex(2, 2), null);
});

test('switches to a different item when another is clicked', () => {
  assert.equal(nextAccordionIndex(2, 0), 0);
});
