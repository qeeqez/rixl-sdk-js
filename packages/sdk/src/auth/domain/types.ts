export enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
}

export interface DomainResponse {
  id: string;
  domain: string;
  status: string;
  verification_token?: string;
  verified_at?: string;
  expires_at?: string;
  auto_join?: boolean;
  message?: string;
  present?: boolean;
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
