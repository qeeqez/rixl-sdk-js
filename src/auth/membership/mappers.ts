import type {AuthV1Membership, AuthV1OrgMember, AuthV1MembershipRole, AuthV1MembershipState} from "../../generated/types.gen";
import {MembershipRole, MembershipState, type Membership, type Member} from "./types";

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

export function toMembership(m: AuthV1Membership): Membership {
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

export function toMember(m: AuthV1OrgMember): Member {
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
