// Membership role and state types
export enum MembershipRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export type AssignableRole = MembershipRole.ADMIN | MembershipRole.MEMBER;

export enum MembershipState {
  ACCEPTED = "accepted",
  PENDING = "pending",
  DECLINED = "declined",
  ACCEPT = "accept",
  DECLINE = "decline",
}

// Membership type
export interface Common {
  user_id: string;
  org_id: string;
  role: MembershipRole;
  state: MembershipState;
}

// Membership with organization details
export interface Membership extends Common {
  organization_username: string;
  organization_first_name: string;
  organization_last_name: string;
}

// Member type with user details
export interface Member extends Common {
  username: string;
  first_name: string;
  last_name: string;
  image_url: string;
  created_at: string;
  joined_at: string;
}

// Invite member request
export interface InviteMemberRequest {
  username: string;
  role: AssignableRole;
}

// Resend Invite member request
export interface ResendInviteMemberRequest {
  user_id: string;
}

// Update member role request
export interface UpdateMemberRoleRequest {
  role: AssignableRole;
}
