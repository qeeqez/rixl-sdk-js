import type {AuthV1DomainResponse, AuthV1AutoJoinSetting} from "../../generated/types.gen";
import {DomainStatus, type DomainResponse, type AutoJoinSetting} from "./types";

// DomainStatus is a nested oneOf (pending | verified) plus a shared auto_join
// flag; flatten it into the library's DomainResponse.
export function toDomainResponse(data: AuthV1DomainResponse): DomainResponse {
  const status = data.status;
  const verified = status && "verified" in status ? status.verified : undefined;
  const pending = status && "pending" in status ? status.pending : undefined;
  return {
    present: data.present,
    id: data.id ?? "",
    domain: data.domain ?? "",
    status: verified ? DomainStatus.VERIFIED : DomainStatus.PENDING,
    verification_token: pending?.verification_token,
    expires_at: pending?.expires_at,
    verified_at: verified?.verified_at,
    auto_join: status?.auto_join,
  };
}

export function toAutoJoinSetting(data: AuthV1AutoJoinSetting): AutoJoinSetting {
  return {
    enabled: data.enabled ?? false,
    present: data.present,
  };
}
