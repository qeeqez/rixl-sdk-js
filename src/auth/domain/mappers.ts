import type {AuthV1DomainResponse, AuthV1AutoJoinSetting} from "../../generated/types.gen";
import {DomainStatus, type DomainResponse, type AutoJoinSetting} from "./types";

// DomainStatus is a nested oneOf (pending | verified) plus a shared auto_join
// flag; flatten it into the library's DomainResponse. When the gateway omits
// `status` entirely we leave the flattened `status` field undefined instead
// of defaulting to PENDING — the two states carry very different meanings
// and PENDING would incorrectly imply a verification is in flight.
export function toDomainResponse(data: AuthV1DomainResponse): DomainResponse {
  const status = data.status;
  const verified = status && "verified" in status ? status.verified : undefined;
  const pending = status && "pending" in status ? status.pending : undefined;
  let flattenedStatus: DomainStatus | undefined;
  if (verified) {
    flattenedStatus = DomainStatus.VERIFIED;
  } else if (pending) {
    flattenedStatus = DomainStatus.PENDING;
  }
  return {
    present: data.present,
    id: data.id ?? "",
    domain: data.domain ?? "",
    status: flattenedStatus,
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
