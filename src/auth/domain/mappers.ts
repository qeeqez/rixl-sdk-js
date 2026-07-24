import {DomainStatus, type DomainResponse, type AutoJoinSetting} from "./types";

// The gateway serializes responses in snake_case, while the generated types
// model them in camelCase. DomainStatus is a nested oneOf (pending | verified)
// plus a shared auto_join flag; flatten it into the library's DomainResponse.
interface WirePendingDomain {
  verification_token?: string;
  expires_at?: string;
}

interface WireVerifiedDomain {
  verified_at?: string;
}

interface WireDomainStatus {
  auto_join?: boolean;
  pending?: WirePendingDomain;
  verified?: WireVerifiedDomain;
}

interface WireDomainResponse {
  present?: boolean;
  id?: string;
  domain?: string;
  status?: WireDomainStatus;
}

interface WireAutoJoinSetting {
  present?: boolean;
  enabled?: boolean;
}

export function toDomainResponse(data: unknown): DomainResponse {
  const wire = (data ?? {}) as WireDomainResponse;
  const status = wire.status ?? {};
  return {
    present: wire.present,
    id: wire.id ?? "",
    domain: wire.domain ?? "",
    status: status.verified ? DomainStatus.VERIFIED : DomainStatus.PENDING,
    verification_token: status.pending?.verification_token,
    expires_at: status.pending?.expires_at,
    verified_at: status.verified?.verified_at,
    auto_join: status.auto_join,
  };
}

export function toAutoJoinSetting(data: unknown): AutoJoinSetting {
  const wire = (data ?? {}) as WireAutoJoinSetting;
  return {
    enabled: wire.enabled ?? false,
    present: wire.present,
  };
}
