import {getUserInfo} from "../user";
import {permissions, permissionsResolved} from "../permissionStore";

/**
 * Incremented whenever the identity's scope changes — an organization switch,
 * a sign-out. A response that started before the change belongs to the previous
 * scope and must not be written into the store.
 */
let epoch = 0;

/** An `ensurePermissions` call already in flight, so concurrent guards share one request. */
let pending: Promise<void> | null = null;

/**
 * Invalidates any resolution already in flight.
 *
 * Call before switching the active organization: without it, a request issued
 * for the previous organization can land afterwards and repopulate the store
 * with permissions the user no longer holds.
 */
export const invalidatePermissions = (): void => {
  epoch += 1;
  pending = null;
};

/**
 * Loads the effective permissions for the signed-in user.
 *
 * `GET /auth/v1/userinfo` is the authoritative source: it returns the
 * permissions and the policies granting them, scoped to the user's active
 * organization. Call this after sign-in and again whenever the active
 * organization changes, since the response is scoped to it.
 *
 * Always issues a fresh request — it is the caller's way of saying the answer
 * may have changed. On failure the error propagates and the held set is left
 * untouched, so a transient network error does not revoke the interface; a
 * caller changing scope should clear the set first so a failure denies rather
 * than keeps stale grants.
 */
export const resolvePermissions = async (): Promise<void> => {
  const started = epoch;
  const info = await getUserInfo();

  // A switch happened while this was in flight; its answer is for the old scope.
  if (started !== epoch) return;

  permissions.set(new Set(info.permissions));
  permissionsResolved.set(true);
};

/**
 * Resolves permissions unless they already have been for the active
 * organization.
 *
 * Route guards need an answer before deciding whether to redirect, but must not
 * pay for a request on every navigation. Use `resolvePermissions` when the
 * answer must be refreshed — after an organization switch — and this when any
 * current answer will do.
 */
export const ensurePermissions = async (): Promise<void> => {
  if (permissionsResolved.get()) return;
  if (pending) return pending;

  const started = epoch;
  pending = resolvePermissions().finally(() => {
    if (started === epoch) pending = null;
  });

  return pending;
};
