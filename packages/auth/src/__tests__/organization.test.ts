/**
 * Organization management tests
 * Tests: updateOrgName, updateOrgUsername
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateOrgName, updateOrgUsername } from "../organization";

vi.mock("../utils/nameUpdates", () => ({
  updateEntityField: vi.fn(),
}));

describe("Organization Management", () => {
  let mockUpdateEntityField: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const nameUpdatesModule = await import("../utils/nameUpdates");
    mockUpdateEntityField = nameUpdatesModule.updateEntityField;
  });

  describe("updateOrgName", () => {
    it("should call updateEntityField with correct parameters", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateOrgName("New Org Name", "org123");

      expect(mockUpdateEntityField).toHaveBeenCalledWith({
        value: "New Org Name",
        type: "name",
        endpoint: "memberships/org123/name",
        method: "PUT",
      });
    });

    it("should handle valid organization names", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await expect(updateOrgName("Valid Organization", "org456")).resolves.toBeUndefined();
      expect(mockUpdateEntityField).toHaveBeenCalledTimes(1);
    });

    it("should pass through errors from updateEntityField", async () => {
      const error = new Error("Name update failed");
      mockUpdateEntityField.mockRejectedValue(error);

      await expect(updateOrgName("Test Org", "org789")).rejects.toThrow("Name update failed");
    });

    it("should handle different organization IDs", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateOrgName("Org Name", "org-abc-123");

      expect(mockUpdateEntityField).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: "memberships/org-abc-123/name",
        }),
      );
    });
  });

  describe("updateOrgUsername", () => {
    it("should call updateEntityField with correct parameters", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateOrgUsername("neworgusername", "org123");

      expect(mockUpdateEntityField).toHaveBeenCalledWith({
        value: "neworgusername",
        type: "username",
        endpoint: "memberships/org123/username",
        method: "PUT",
      });
    });

    it("should handle valid organization usernames", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await expect(updateOrgUsername("valid_org_user", "org456")).resolves.toBeUndefined();
      expect(mockUpdateEntityField).toHaveBeenCalledTimes(1);
    });

    it("should pass through errors from updateEntityField", async () => {
      const error = new Error("Username already taken");
      mockUpdateEntityField.mockRejectedValue(error);

      await expect(updateOrgUsername("takenusername", "org789")).rejects.toThrow(
        "Username already taken",
      );
    });

    it("should handle different organization IDs", async () => {
      mockUpdateEntityField.mockResolvedValue(undefined);

      await updateOrgUsername("orguser", "org-xyz-789");

      expect(mockUpdateEntityField).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: "memberships/org-xyz-789/username",
        }),
      );
    });
  });
});
