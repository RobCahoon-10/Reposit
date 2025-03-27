import { strict as assert } from "assert";
import { describe, it } from "node:test";
import { isValidUKPostcode } from "./is-valid-uk-postcode";

describe("isValidUKPostcode", () => {
  it("should return true for valid UK postcodes", () => {
    assert.strictEqual(isValidUKPostcode("CF10 1AA"), true);
    assert.strictEqual(isValidUKPostcode("SW1A 1AA"), true);
    assert.strictEqual(isValidUKPostcode("EH1 1AA"), true);
  });

  it("should return false for invalid UK postcodes", () => {
    assert.strictEqual(isValidUKPostcode("INVALID"), false);
    assert.strictEqual(isValidUKPostcode("12345"), false);
    assert.strictEqual(isValidUKPostcode("ABCDE"), false);
  });

  it("should return false for empty string", () => {
    assert.strictEqual(isValidUKPostcode(""), false);
  });

  it("should return false for null and undefined", () => {
    assert.strictEqual(isValidUKPostcode(null as any), false);
    assert.strictEqual(isValidUKPostcode(undefined as any), false);
  });
});
