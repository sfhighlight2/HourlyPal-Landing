// js/validate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from './validate.js';

test('accepts a normal email address', () => {
  assert.equal(isValidEmail('pal@example.com'), true);
});

test('trims surrounding whitespace before validating', () => {
  assert.equal(isValidEmail('  pal@example.com  '), true);
});

test('rejects a string with no @', () => {
  assert.equal(isValidEmail('palexample.com'), false);
});

test('rejects a string with no domain suffix', () => {
  assert.equal(isValidEmail('pal@example'), false);
});

test('rejects an empty string', () => {
  assert.equal(isValidEmail(''), false);
});
