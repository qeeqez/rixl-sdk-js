/**
 * Membership List Module Tests
 * Tests: listActiveMemberships, listPendingMemberships, listOrganizationMembers
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  listActiveMemberships,
  listPendingMemberships,
  listOrganizationMembers,
} from "@/membership";
import { Membership, Member, MembershipRole, MembershipState } from "@/membership";

// Mock pagination-utils
vi.mock("../../pagination-utils", () => ({
  fetchPaginatedData: vi.fn(),
}));

// Mock authStore
vi.mock("../../authStore", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
}));

describe("Membership List Module", () => {
  let mockFetchPaginatedData: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const paginationUtils = await import("../../pagination-utils");
    mockFetchPaginatedData = paginationUtils.fetchPaginatedData;
  });

  describe("listActiveMemberships", () => {
    it("should fetch active memberships without pagination", async () => {
      const mockMemberships: Membership[] = [
        {
          org_id: "org123",
          organization_username: "testorg",
          organization_first_name: "Test",
          organization_last_name: "Org",
          user_id: "user123",
          role: MembershipRole.ADMIN,
          state: MembershipState.ACCEPTED,
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMemberships);

      const result = await listActiveMemberships();

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/active",
        expect.any(Function),
        undefined,
        "User is not authorized to list memberships!",
      );
      expect(result).toEqual(mockMemberships);
    });

    it("should fetch active memberships with pagination", async () => {
      const mockMemberships: Membership[] = [
        {
          org_id: "org1",
          organization_username: "org1",
          organization_first_name: "Org",
          organization_last_name: "1",
          user_id: "user123",
          role: MembershipRole.MEMBER,
          state: MembershipState.ACCEPTED,
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMemberships);

      const paginationParams = { limit: 10, offset: 0 };
      const result = await listActiveMemberships(paginationParams);

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/active",
        expect.any(Function),
        paginationParams,
        "User is not authorized to list memberships!",
      );
      expect(result).toEqual(mockMemberships);
    });

    it("should return empty array when no memberships", async () => {
      mockFetchPaginatedData.mockResolvedValue([]);

      const result = await listActiveMemberships();

      expect(result).toEqual([]);
    });

    it("should handle multiple memberships", async () => {
      const mockMemberships: Membership[] = [
        {
          org_id: "org1",
          organization_username: "org1",
          organization_first_name: "Org",
          organization_last_name: "1",
          user_id: "user123",
          role: MembershipRole.ADMIN,
          state: MembershipState.ACCEPTED,
        },
        {
          org_id: "org2",
          organization_username: "org2",
          organization_first_name: "Org",
          organization_last_name: "2",
          user_id: "user123",
          role: MembershipRole.MEMBER,
          state: MembershipState.ACCEPTED,
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMemberships);

      const result = await listActiveMemberships();

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockMemberships);
    });
  });

  describe("listPendingMemberships", () => {
    it("should fetch pending memberships without pagination", async () => {
      const mockMemberships: Membership[] = [
        {
          org_id: "org456",
          organization_username: "pendingorg",
          organization_first_name: "Pending",
          organization_last_name: "Org",
          user_id: "user123",
          role: MembershipRole.MEMBER,
          state: MembershipState.PENDING,
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMemberships);

      const result = await listPendingMemberships();

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/pending",
        expect.any(Function),
        undefined,
        "User is not authorized to list memberships!",
      );
      expect(result).toEqual(mockMemberships);
    });

    it("should fetch pending memberships with pagination", async () => {
      const mockMemberships: Membership[] = [
        {
          org_id: "org789",
          organization_username: "neworg",
          organization_first_name: "New",
          organization_last_name: "Org",
          user_id: "user123",
          role: MembershipRole.MEMBER,
          state: MembershipState.PENDING,
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMemberships);

      const paginationParams = { limit: 5, offset: 10 };
      const result = await listPendingMemberships(paginationParams);

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/pending",
        expect.any(Function),
        paginationParams,
        "User is not authorized to list memberships!",
      );
      expect(result).toEqual(mockMemberships);
    });

    it("should return empty array when no pending memberships", async () => {
      mockFetchPaginatedData.mockResolvedValue([]);

      const result = await listPendingMemberships();

      expect(result).toEqual([]);
    });
  });

  describe("listOrganizationMembers", () => {
    it("should fetch organization members without pagination", async () => {
      const mockMembers: Member[] = [
        {
          org_id: "org123",
          user_id: "user456",
          username: "john_doe",
          first_name: "John",
          last_name: "Doe",
          image_url: "https://example.com/john.jpg",
          role: MembershipRole.ADMIN,
          state: MembershipState.ACCEPTED,
          created_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMembers);

      const result = await listOrganizationMembers("org123");

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/org123/members",
        expect.any(Function),
        undefined,
        "User is not authorized to list organization members!",
      );
      expect(result).toEqual(mockMembers);
    });

    it("should fetch organization members with pagination", async () => {
      const mockMembers: Member[] = [
        {
          org_id: "org456",
          user_id: "user789",
          username: "jane_smith",
          first_name: "Jane",
          last_name: "Smith",
          image_url: "https://example.com/jane.jpg",
          role: MembershipRole.MEMBER,
          state: MembershipState.ACCEPTED,
          created_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMembers);

      const paginationParams = { limit: 20, offset: 0 };
      const result = await listOrganizationMembers("org456", paginationParams);

      expect(mockFetchPaginatedData).toHaveBeenCalledWith(
        "memberships/org456/members",
        expect.any(Function),
        paginationParams,
        "User is not authorized to list organization members!",
      );
      expect(result).toEqual(mockMembers);
    });

    it("should return empty array when no members", async () => {
      mockFetchPaginatedData.mockResolvedValue([]);

      const result = await listOrganizationMembers("org999");

      expect(result).toEqual([]);
    });

    it("should handle multiple members with different roles", async () => {
      const mockMembers: Member[] = [
        {
          org_id: "org123",
          user_id: "user1",
          username: "admin_user",
          first_name: "Admin",
          last_name: "User",
          image_url: "",
          role: MembershipRole.ADMIN,
          state: MembershipState.ACCEPTED,
          created_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
        },
        {
          org_id: "org123",
          user_id: "user2",
          username: "regular_member",
          first_name: "Regular",
          last_name: "Member",
          image_url: "",
          role: MembershipRole.MEMBER,
          state: MembershipState.ACCEPTED,
          created_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
        },
        {
          org_id: "org123",
          user_id: "user3",
          username: "pending_user",
          first_name: "Pending",
          last_name: "User",
          image_url: "",
          role: MembershipRole.MEMBER,
          state: MembershipState.PENDING,
          created_at: new Date().toISOString(),
          joined_at: new Date().toISOString(),
        },
      ];

      mockFetchPaginatedData.mockResolvedValue(mockMembers);

      const result = await listOrganizationMembers("org123");

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockMembers);
    });
  });
});
