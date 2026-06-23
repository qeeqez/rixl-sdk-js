/**
 * Name update tests
 * Tests: updateEntityField for name changes
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { updateEntityField } from "@/utils/nameUpdates.ts";
import { authenticatedFetch } from "../../api/fetchers";
import { ApiError } from "../../api/types";
import * as authStore from "@/authStore";
import { HTTP_STATUS } from "@/constants.ts";
import { setupEntityUpdateTest } from "./entity-update-test-helpers";

// Create mock using factory pattern - eliminates 33 lines of duplication!
vi.mock("../../api/fetchers", () => ({
  authenticatedFetch: vi.fn(),
}));

vi.mock("../../api/types", () => ({
  ApiError: class ApiError extends Error {
    constructor(
      public message: string,
      public status: number,
      public endpoint: string,
      public data?: any,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

describe("Name Updates", () => {
  const mockAuthenticatedFetch = authenticatedFetch as any;
  let mockGetToken: any;

  beforeEach(() => {
    const mocks = setupEntityUpdateTest(authStore);
    mockGetToken = mocks.mockGetToken;
  });

  afterEach(() => {
    mockGetToken?.mockRestore();
  });

  describe("Success cases", () => {
    it("should update name successfully", async () => {
      mockAuthenticatedFetch.mockResolvedValue(undefined);

      await updateEntityField({
        value: "John Doe",
        type: "name",
        endpoint: "users/current/name",
        method: "PUT",
      });

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        "users/current/name",
        authStore.getToken,
        {
          method: "PUT",
          body: { full_name: "John Doe" },
        },
      );
    });
  });

  describe("Error cases", () => {
    it("should throw error for invalid name length", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Error", HTTP_STATUS.BAD_REQUEST, "/endpoint"),
      );

      await expect(
        updateEntityField({
          value: "A very long name that exceeds the maximum",
          type: "name",
          endpoint: "users/current/name",
        }),
      ).rejects.toThrow("Name must be 1-30 characters long");
    });

    it("should throw error for rate limit on name change", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Error", HTTP_STATUS.TOO_MANY_REQUESTS, "/endpoint"),
      );

      await expect(
        updateEntityField({
          value: "New Name",
          type: "name",
          endpoint: "users/current/name",
        }),
      ).rejects.toThrow("Name can only be changed once every 7 days.");
    });

    it("should handle conflict error for name", async () => {
      mockAuthenticatedFetch.mockRejectedValue(
        new ApiError("Error", HTTP_STATUS.CONFLICT, "/endpoint"),
      );

      await expect(
        updateEntityField({
          value: "Conflicting Name",
          type: "name",
          endpoint: "users/current/name",
        }),
      ).rejects.toThrow("Failed to update name");
    });
  });

  describe("Validation edge cases", () => {
    it("should validate name with empty string", async () => {
      await expect(
        updateEntityField({
          value: "",
          type: "name",
          endpoint: "users/current/name",
        }),
      ).rejects.toThrow("Name must be 1-30 characters long");
    });

    it("should validate name with maximum length", async () => {
      await expect(
        updateEntityField({
          value: "a".repeat(31),
          type: "name",
          endpoint: "users/current/name",
        }),
      ).rejects.toThrow("Name must be 1-30 characters long");
    });
  });
});
