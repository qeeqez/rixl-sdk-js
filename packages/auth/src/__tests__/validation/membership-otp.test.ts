/**
 * Membership and OTP validation tests
 * Tests: InviteMemberSchema, UpdateMemberRoleSchema, VerifyOTPCodeSchema, ConnectProviderSchema
 */

import { describe, it } from "vitest";
import { VerifyOTPCodeSchema, ConnectProviderSchema } from "../../validation/auth";
import { InviteMemberSchema, UpdateMemberRoleSchema } from "../../validation/membership";
import { testValidInputs, testInvalidInputs } from "../utils/validation-test-helpers";

describe("InviteMemberSchema", () => {
  it("should accept valid invite configurations", () => {
    testValidInputs(InviteMemberSchema, [
      { username: "newmember", role: "member" },
      { username: "adminuser", role: "admin" },
      { username: "owneruser", role: "owner" },
    ]);
  });

  it("should reject invalid inputs", () => {
    testInvalidInputs(InviteMemberSchema, [
      { username: "testuser", role: "invalid" }, // invalid role
      { username: "ab", role: "member" }, // username too short
    ]);
  });
});

describe("UpdateMemberRoleSchema", () => {
  it("should accept valid role", () => {
    testValidInputs(UpdateMemberRoleSchema, [
      { role: "admin" },
      { role: "member" },
      { role: "owner" },
    ]);
  });

  it("should reject invalid role", () => {
    testInvalidInputs(UpdateMemberRoleSchema, [{ role: "superuser" }, { role: "invalid" }]);
  });
});

describe("ConnectProviderSchema", () => {
  it("should accept valid provider connections", () => {
    testValidInputs(ConnectProviderSchema, [
      { provider: "google", token: "oauth-token-123" },
      { provider: "apple", token: "apple-token-xyz" },
    ]);
  });

  it("should reject invalid inputs", () => {
    testInvalidInputs(ConnectProviderSchema, [
      { provider: "", token: "token" }, // empty provider
      { provider: "google", token: "" }, // empty token
    ]);
  });
});

describe("VerifyOTPCodeSchema", () => {
  it("should accept valid OTP codes", () => {
    testValidInputs(VerifyOTPCodeSchema, [
      { code: "123456" }, // 6 digits
      { code: "12345678" }, // 8 digits
    ]);
  });

  it("should reject invalid codes", () => {
    testInvalidInputs(VerifyOTPCodeSchema, [
      { code: "12345" }, // too short
      { code: "abcdef" }, // non-numeric
      { code: "123 456" }, // with spaces
    ]);
  });
});
