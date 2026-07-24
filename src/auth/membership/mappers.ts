import type {AuthV1MembershipRole, AuthV1MembershipState} from "../../generated/types.gen";
import {MembershipRole, MembershipState, type Membership, type Member} from "./types";

// The gateway serializes memberships in snake_case with proto enum values, while
// the generated types model them in camelCase. The wire shape is snake_case, so
// read it directly (the generated camelCase types never arrive over the wire).
interface WireMembership {
  id?: string;
  user_id?: string;
  org_id?: string;
  role?: AuthV1MembershipRole;
  state?: AuthV1MembershipState;
  joined_at?: string;
  organization_username?: string;
  organization_first_name?: string;
  organization_last_name?: string;
}

interface WireMember {
  id?: string;
  user_id?: string;
  org_id?: string;
  role?: AuthV1MembershipRole;
  state?: AuthV1MembershipState;
  joined_at?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  invitation_expires_at?: string;
}

const ROLE_FROM_PROTO: Record<AuthV1MembershipRole, MembershipRole> = {
  MEMBERSHIP_ROLE_UNSPECIFIED: MembershipRole.MEMBER,
  MEMBERSHIP_ROLE_OWNER: MembershipRole.OWNER,
  MEMBERSHIP_ROLE_ADMIN: MembershipRole.ADMIN,
  MEMBERSHIP_ROLE_MEMBER: MembershipRole.MEMBER,
};

const STATE_FROM_PROTO: Record<AuthV1MembershipState, MembershipState> = {
  MEMBERSHIP_STATE_UNSPECIFIED: MembershipState.PENDING,
  MEMBERSHIP_STATE_PENDING: MembershipState.PENDING,
  MEMBERSHIP_STATE_ACCEPTED: MembershipState.ACCEPTED,
  MEMBERSHIP_STATE_DECLINED: MembershipState.DECLINED,
};

function toRole(role?: AuthV1MembershipRole): MembershipRole {
  return ROLE_FROM_PROTO[role ?? "MEMBERSHIP_ROLE_UNSPECIFIED"];
}

function toState(state?: AuthV1MembershipState): MembershipState {
  return STATE_FROM_PROTO[state ?? "MEMBERSHIP_STATE_UNSPECIFIED"];
}

export function toMembership(m: WireMembership): Membership {
  return {
    id: m.id ?? "",
    user_id: m.user_id ?? "",
    org_id: m.org_id ?? "",
    role: toRole(m.role),
    state: toState(m.state),
    joined_at: m.joined_at,
    organization_username: m.organization_username ?? "",
    organization_first_name: m.organization_first_name ?? "",
    organization_last_name: m.organization_last_name ?? "",
  };
}

export function toMember(m: WireMember): Member {
  return {
    id: m.id ?? "",
    user_id: m.user_id ?? "",
    org_id: m.org_id ?? "",
    role: toRole(m.role),
    state: toState(m.state),
    joined_at: m.joined_at,
    username: m.username ?? "",
    first_name: m.first_name ?? "",
    last_name: m.last_name ?? "",
    invitation_expires_at: m.invitation_expires_at,
  };
}
