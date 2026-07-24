export enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
}

export interface DomainResponse {
  present?: boolean;
  id: string;
  domain: string;
  status: DomainStatus;
  verification_token?: string;
  expires_at?: string;
  verified_at?: string;
  auto_join?: boolean;
}

export interface AddDomainRequest {
  domain: string;
}

export interface UpdateAutoJoinRequest {
  enabled: boolean;
}

export interface AutoJoinSetting {
  enabled: boolean;
  present?: boolean;
}
