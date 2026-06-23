/**
 * Username update tests
 * Tests: updateEntityField for username changes
 */

import { describe, it, expect, vi } from "vitest";
import { updateEntityField } from "@/utils/nameUpdates.ts";
import * as authStore from "@/authStore";
import { HTTP_STATUS } from "@/constants.ts";
import { createApiError, useEntityUpdateTest } from "./entity-update-test-helpers";
import { mockAuthenticatedFetch } from "../setup/api-mocks";

vi.mock("../../api/fetchers", async () => {
  const { mockPublicFetch, mockAuthenticatedFetch } = await import("../setup/api-mocks");
  return {
    publicFetch: mockPublicFetch,
    authenticatedFetch: mockAuthenticatedFetch,
  };
});

import { testTokenRefreshBehavior } from "./token-refresh-test-helper";

describe("Username Updates", () => {
  const ENDPOINT = "users/current/username";
  // mockAuthenticatedFetch is imported directly
  const mocks = useEntityUpdateTest(authStore);

  describe("Success cases", () => {
    it("should update username successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await updateEntityField({
        value: "newusername",
        type: "username",
        endpoint: ENDPOINT,
        method: "PATCH",
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(ENDPOINT, authStore.getToken, {
        method: "PATCH",
        body: { username: "newusername" },
      });
    });

    it("should default to PATCH method", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await updateEntityField({
        value: "username",
        type: "username",
        endpoint: ENDPOINT,
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function),
        expect.objectContaining({ method: "PATCH" }),
      );
    });
  });

  describe("Error cases", () => {
    const errorCases = [
      {
        desc: "duplicate username",
        status: HTTP_STATUS.CONFLICT,
        msg: "Username is not unique. Choose another one!",
        value: "existinguser",
      },
      {
        desc: "rate limit",
        status: HTTP_STATUS.TOO_MANY_REQUESTS,
        msg: "Username can only be changed once every 30 days.",
        value: "newuser",
      },
      {
        desc: "unauthorized user",
        status: HTTP_STATUS.UNAUTHORIZED,
        msg: "User is not authorized to update username",
        value: "newuser",
      },
      {
        desc: "forbidden access",
        status: HTTP_STATUS.FORBIDDEN,
        msg: "Only owners and admins can update username",
        value: "newuser",
      },
    ];

    it.each(errorCases)("should throw error for $desc", async ({ status, msg, value }) => {
      mockAuthenticatedFetch.mockRejectedValue(createApiError(status));

      await expect(
        updateEntityField({
          value,
          type: "username",
          endpoint: ENDPOINT,
        }),
      ).rejects.toThrow(msg);
    });
  });

  describe("Validation edge cases", () => {
    it.each([
      { desc: "minimum length", val: "abc", msg: "Username must be 4-24 characters long" },
      { desc: "maximum length", val: "a".repeat(25), msg: "Username must be 4-24 characters long" },
      {
        desc: "uppercase letters",
        val: "UserName",
        msg: "Username can only contain lowercase letters, numbers, dots and underscores",
      },
    ])("should validate username with $desc", async ({ val, msg }) => {
      await expect(
        updateEntityField({
          value: val,
          type: "username",
          endpoint: ENDPOINT,
        }),
      ).rejects.toThrow(msg);
    });
  });

  describe("Token refresh handling", () => {
    testTokenRefreshBehavior(
      (handleTokenRefresh) =>
        updateEntityField({
          value: "newusername",
          type: "username",
          endpoint: ENDPOINT,
          handleTokenRefresh,
        }),
      mockAuthenticatedFetch,
      () => mocks.mockSetTokens,
    );
  });
});
