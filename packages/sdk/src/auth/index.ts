// Auth state exports
export {
  isLogged,
  getToken,
  login,
  authError,
  clearAuthError,
  requiresAction,
  limitedAccessToken,
  setLimitedAccessState,
  clearLimitedAccessState,
} from "./authStore";

export {logout} from "./auth/logout";

export {user} from "./userStore";

// Type exports
export type {User, TokenResponse, LimitedScopeTokenResponse, RequiresAction} from "./types";

// Initialization exports
export {initClient, type AuthClientConfig} from "./init";

// Provider exports
export {type GoogleProviderConfig, type AppleProviderConfig, type TelegramProviderConfig} from "./providers";

export {
  leaveOrganization,
  listActiveMemberships,
  listPendingMemberships,
  updateActiveMembership,
  listOrganizationMembers,
  inviteMember,
  updateMemberRole,
  deleteMember,
  MembershipRole,
  type AssignableRole,
  MembershipState,
  respondToInvitation,
  resendMemberInvite,
  publicRespondToInvitation,
  type Member,
  type Membership,
  type InviteMemberRequest,
  type UpdateMemberRoleRequest,
  type ResendInviteMemberRequest,
} from "./membership";

export {
  updateFullName,
  updateUsername,
  verifyUserOTP,
  setupUserOTP,
  deleteUserOTP,
  getOTPStatus,
  type OTPSetup,
  type OTPStatusResponse,
} from "./user";
export {updateOrgName, updateOrgUsername} from "./organization";

export {listSocials, connectSocial, disconnectSocial, type ConnectedProvider, type ProviderType} from "./social/socialConnections";

export {
  registerWithEmail,
  loginWithEmail,
  verifyTOTPForLogin,
  resendEmailVerificationCode,
  initiateEmailChange,
  addEmail,
  verifyEmailWithCode,
  getEmailVerificationStatus,
  sendPasswordResetEmail,
  confirmPasswordReset,
  type VerifyStatusResponse,
  type RegistrationResponse,
  type VerificationSentResponse,
  type OTPVerificationResponse,
  type LoginOTPVerifyRequest,
  type LoginErrorResponse,
  type LoginErrorCode,
  type OAuth2ErrorResponse,
} from "./auth";

// Domain verification exports
export {
  getDomainStatus,
  initiateDomainVerification,
  checkDomainVerification,
  updateAutoJoin,
  removeDomain,
  DomainStatus,
  type DomainResponse,
  type AddDomainRequest,
  type UpdateAutoJoinRequest,
  type AutoJoinSetting,
} from "./domain";

export {getBlogSubscriptionStatus, subscribeToBlog, unsubscribeFromBlog, type BlogSubscriptionStatus} from "./blog";

export {
  beginPasskeyLogin,
  beginPasskeyRegistration,
  deletePasskey,
  finishPasskeyRegistration,
  listPasskeys,
  renamePasskey,
  type Passkey,
  type PasskeyBeginLogin,
  type PasskeyBeginRegistration,
  type PasskeyRegistrationResult,
} from "./passkey";
