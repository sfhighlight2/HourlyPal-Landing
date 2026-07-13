// js/counter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countUpValue } from './counter.js';

test('returns the start value at elapsed = 0', () => {
  assert.equal(countUpValue(0, 1000, 0, 500), 0);
});

test('returns the end value once elapsed reaches the duration', () => {
  assert.equal(countUpValue(1000, 1000, 0, 500), 500);
});

test('clamps to the end value if elapsed exceeds the duration', () => {
  assert.equal(countUpValue(5000, 1000, 0, 500), 500);
});

test('eases out (progress is ahead of linear at the midpoint)', () => {
  const value = countUpValue(500, 1000, 0, 500);
  assert.equal(value, 438); // ease-out cubic at t=0.5 -> 0.875 -> round(437.5)
});
