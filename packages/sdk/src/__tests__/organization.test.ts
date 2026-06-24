import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateOrgName, updateOrgUsername } from "../auth/organization";
import * as initialization from "../auth/initialization";

const mockPutAuthV1MembershipsByOrgIdName = vi.fn();
const mockPutAuthV1MembershipsByOrgIdUsername = vi.fn();

vi.mock("../generated/sdk.gen", () => ({
  putAuthV1MembershipsByOrgIdName: (...args: unknown[]) =>
    mockPutAuthV1MembershipsByOrgIdName(...args),
  putAuthV1MembershipsByOrgIdUsername: (...args: unknown[]) =>
    mockPutAuthV1MembershipsByOrgIdUsername(...args),
}));

describe("Organization Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    initialization.initDeferred.promise = Promise.resolve();
    mockPutAuthV1MembershipsByOrgIdName.mockReset();
    mockPutAuthV1MembershipsByOrgIdUsername.mockReset();
  });

  describe("updateOrgName", () => {
    it("should update org name successfully", async () => {
      mockPutAuthV1MembershipsByOrgIdName.mockResolvedValue({ data: {} });

      await updateOrgName("New Org Name", "org123");

      expect(mockPutAuthV1MembershipsByOrgIdName).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        body: { full_name: "New Org Name" },
        throwOnError: true,
      });
    });

    it("should handle valid organization names", async () => {
      mockPutAuthV1MembershipsByOrgIdName.mockResolvedValue({ data: {} });

      await expect(updateOrgName("Valid Organization", "org456")).resolves.toBeUndefined();
    });

    it("should handle errors", async () => {
      mockPutAuthV1MembershipsByOrgIdName.mockRejectedValue({ error: "unauthorized", code: 401 });

      await expect(updateOrgName("Test Org", "org789")).rejects.toThrow();
    });

    it("should handle different organization IDs", async () => {
      mockPutAuthV1MembershipsByOrgIdName.mockResolvedValue({ data: {} });

      await updateOrgName("Org Name", "org-abc-123");

      expect(mockPutAuthV1MembershipsByOrgIdName).toHaveBeenCalledWith({
        path: { orgId: "org-abc-123" },
        body: { full_name: "Org Name" },
        throwOnError: true,
      });
    });

    it("should validate name format", async () => {
      await expect(updateOrgName("", "org123")).rejects.toThrow();
    });
  });

  describe("updateOrgUsername", () => {
    it("should update org username successfully", async () => {
      mockPutAuthV1MembershipsByOrgIdUsername.mockResolvedValue({ data: {} });

      await updateOrgUsername("neworgusername", "org123");

      expect(mockPutAuthV1MembershipsByOrgIdUsername).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        body: { username: "neworgusername" },
        throwOnError: true,
      });
    });

    it("should handle valid organization usernames", async () => {
      mockPutAuthV1MembershipsByOrgIdUsername.mockResolvedValue({ data: {} });

      await expect(updateOrgUsername("valid_org_user", "org456")).resolves.toBeUndefined();
    });

    it("should handle errors", async () => {
      mockPutAuthV1MembershipsByOrgIdUsername.mockRejectedValue({ error: "conflict", code: 409 });

      await expect(updateOrgUsername("takenusername", "org789")).rejects.toThrow();
    });

    it("should handle different organization IDs", async () => {
      mockPutAuthV1MembershipsByOrgIdUsername.mockResolvedValue({ data: {} });

      await updateOrgUsername("orguser", "org-xyz-789");

      expect(mockPutAuthV1MembershipsByOrgIdUsername).toHaveBeenCalledWith({
        path: { orgId: "org-xyz-789" },
        body: { username: "orguser" },
        throwOnError: true,
      });
    });

    it("should validate username format", async () => {
      await expect(updateOrgUsername("ab", "org123")).rejects.toThrow();
    });
  });
});
