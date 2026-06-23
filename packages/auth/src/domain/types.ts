/**
 * Domain verification status
 */
export enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
}

/**
 * Response from GET /memberships/{orgId}/domain
 * Returns domain status with verification details
 */
export interface DomainResponse {
  id: string;
  domain: string;
  status: DomainStatus;
  /** Verification token - only present for pending status */
  verification_token?: string;
  /** Timestamp when domain was verified - only present for verified status */
  verified_at?: string;
  /** Token expiration timestamp - only present for pending status */
  expires_at?: string;
  /** Auto-join setting - only present for verified status */
  auto_join?: boolean;

  // for empty status
  message?: string;
  success?: boolean;
}

/**
 * Request body for POST /memberships/{orgId}/domain
 */
export interface AddDomainRequest {
  domain: string;
}

/**
 * Request body for PUT /memberships/{orgId}/domain/auto-join
 */
export interface UpdateAutoJoinRequest {
  enabled: boolean;
}

/**
 * Response from GET/PUT /memberships/{orgId}/domain/auto-join
 */
export interface AutoJoinSetting {
  enabled: boolean;
}
