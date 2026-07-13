// js/nav.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeNavState } from './nav.js';

test('returns "default" at the top of the page', () => {
  assert.equal(computeNavState(0), 'default');
});

test('returns "default" right at the threshold', () => {
  assert.equal(computeNavState(40, 40), 'default');
});

test('returns "condensed" once scrolled past the threshold', () => {
  assert.equal(computeNavState(41, 40), 'condensed');
});

test('uses a default threshold of 40 when not provided', () => {
  assert.equal(computeNavState(100), 'condensed');
});
