/**
 * Username and name validation tests
 * Tests: UpdateUsernameSchema, UpdateNameSchema
 */

import {describe, it} from "vitest";
import {UpdateUsernameSchema, UpdateNameSchema} from "../../auth/validation/user";
import {testValidInputs, testInvalidInputs} from "../utils/validation-test-helpers";

describe("UpdateUsernameSchema", () => {
  describe("Valid inputs", () => {
    it("should accept valid username formats", () => {
      testValidInputs(UpdateUsernameSchema, [
        {username: "validuser"},
        {username: "valid_user"}, // with underscores
        {username: "valid.user"}, // with periods
        {username: "user123"}, // with numbers
        {username: "abcd"}, // exactly 4 characters (minimum)
        {username: "a".repeat(24)}, // exactly 24 characters (maximum)
      ]);
    });
  });

  describe("Invalid inputs", () => {
    it("should reject invalid username formats", () => {
      testInvalidInputs(UpdateUsernameSchema, [
        {username: "abc"}, // too short
        {username: "a".repeat(25)}, // too long
        {username: "user name"}, // with spaces
        {username: "user@name"}, // special characters
        {username: "user#name"},
        {username: "user$name"},
        {username: "UserName"}, // uppercase letters not allowed
        {username: "User123"}, // mixed case not allowed
        {username: ""}, // empty
      ]);
    });
  });
});

describe("UpdateNameSchema", () => {
  describe("Valid inputs", () => {
    it("should accept valid name formats", () => {
      testValidInputs(UpdateNameSchema, [
        {fullName: "John Doe"},
        {fullName: "A"}, // single character (minimum)
        {fullName: "a".repeat(30)}, // exactly 30 characters (maximum)
        {fullName: "Jean-Paul O'Brien"}, // with special characters
      ]);
    });
  });

  describe("Invalid inputs", () => {
    it("should reject invalid name formats", () => {
      testInvalidInputs(UpdateNameSchema, [
        {fullName: "a".repeat(31)}, // too long
        {fullName: ""}, // empty
      ]);
    });
  });
});
