import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  listActiveMemberships,
  listPendingMemberships,
  listOrganizationMembers,
  MembershipRole,
  MembershipState,
} from "@/membership";
import { setupAuthTest, cleanupAuthMocks } from "../utils/auth-test-helpers";
import type { Membership, Member } from "@/membership";

const mockGetAuthV1MembershipsActive = vi.fn();
const mockGetAuthV1MembershipsPending = vi.fn();
const mockGetAuthV1MembershipsByOrgIdMembers = vi.fn();

vi.mock("../../generated/sdk.gen", () => ({
  getAuthV1MembershipsActive: (...args: unknown[]) => mockGetAuthV1MembershipsActive(...args),
  getAuthV1MembershipsPending: (...args: unknown[]) => mockGetAuthV1MembershipsPending(...args),
  getAuthV1MembershipsByOrgIdMembers: (...args: unknown[]) =>
    mockGetAuthV1MembershipsByOrgIdMembers(...args),
}));

describe("Membership List Module", () => {
  let mocks: ReturnType<typeof setupAuthTest>;

  beforeEach(() => {
    mocks = setupAuthTest();
    mockGetAuthV1MembershipsActive.mockReset();
    mockGetAuthV1MembershipsPending.mockReset();
    mockGetAuthV1MembershipsByOrgIdMembers.mockReset();
  });

  afterEach(() => {
    cleanupAuthMocks(mocks);
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

      mockGetAuthV1MembershipsActive.mockResolvedValue({
        data: { memberships: mockMemberships },
      });

      const result = await listActiveMemberships();

      expect(mockGetAuthV1MembershipsActive).toHaveBeenCalledWith({
        query: undefined,
        throwOnError: true,
      });
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

      mockGetAuthV1MembershipsActive.mockResolvedValue({
        data: { memberships: mockMemberships },
      });

      const paginationParams = { limit: 10, offset: 0 };
      const result = await listActiveMemberships(paginationParams);

      expect(mockGetAuthV1MembershipsActive).toHaveBeenCalledWith({
        query: paginationParams,
        throwOnError: true,
      });
      expect(result).toEqual(mockMemberships);
    });

    it("should return empty array when no memberships", async () => {
      mockGetAuthV1MembershipsActive.mockResolvedValue({
        data: { memberships: [] },
      });

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

      mockGetAuthV1MembershipsActive.mockResolvedValue({
        data: { memberships: mockMemberships },
      });

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

      mockGetAuthV1MembershipsPending.mockResolvedValue({
        data: { memberships: mockMemberships },
      });

      const result = await listPendingMemberships();

      expect(mockGetAuthV1MembershipsPending).toHaveBeenCalledWith({
        query: undefined,
        throwOnError: true,
      });
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

      mockGetAuthV1MembershipsPending.mockResolvedValue({
        data: { memberships: mockMemberships },
      });

      const paginationParams = { limit: 5, offset: 10 };
      const result = await listPendingMemberships(paginationParams);

      expect(mockGetAuthV1MembershipsPending).toHaveBeenCalledWith({
        query: paginationParams,
        throwOnError: true,
      });
      expect(result).toEqual(mockMemberships);
    });

    it("should return empty array when no pending memberships", async () => {
      mockGetAuthV1MembershipsPending.mockResolvedValue({
        data: { memberships: [] },
      });

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
          created_at: "2024-01-01T00:00:00Z",
          joined_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockGetAuthV1MembershipsByOrgIdMembers.mockResolvedValue({
        data: { members: mockMembers },
      });

      const result = await listOrganizationMembers("org123");

      expect(mockGetAuthV1MembershipsByOrgIdMembers).toHaveBeenCalledWith({
        path: { orgId: "org123" },
        query: undefined,
        throwOnError: true,
      });
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
          created_at: "2024-01-01T00:00:00Z",
          joined_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockGetAuthV1MembershipsByOrgIdMembers.mockResolvedValue({
        data: { members: mockMembers },
      });

      const paginationParams = { limit: 20, offset: 0 };
      const result = await listOrganizationMembers("org456", paginationParams);

      expect(mockGetAuthV1MembershipsByOrgIdMembers).toHaveBeenCalledWith({
        path: { orgId: "org456" },
        query: paginationParams,
        throwOnError: true,
      });
      expect(result).toEqual(mockMembers);
    });

    it("should return empty array when no members", async () => {
      mockGetAuthV1MembershipsByOrgIdMembers.mockResolvedValue({
        data: { members: [] },
      });

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
          created_at: "2024-01-01T00:00:00Z",
          joined_at: "2024-01-01T00:00:00Z",
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
          created_at: "2024-01-01T00:00:00Z",
          joined_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockGetAuthV1MembershipsByOrgIdMembers.mockResolvedValue({
        data: { members: mockMembers },
      });

      const result = await listOrganizationMembers("org123");

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockMembers);
    });
  });
});
