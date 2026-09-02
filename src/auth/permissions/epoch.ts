import {shared} from "../../shared-runtime";

/**
 * Counts the identity scopes that have come and gone — an organization switch,
 * a sign-out. A response that started under an earlier scope answers a question
 * nobody is asking any more and must not be written into the store.
 *
 * It lives here rather than in `./resolve` so `permissionStore` can retire a
 * scope from `clearPermissions` without importing the resolver, whose module
 * graph reaches back into `authStore`.
 */
const state = shared("permissionEpoch", () => ({current: 0}));

/** The scope in effect right now. Compare against a value captured earlier. */
export const permissionEpoch = (): number => state.current;

/** Retires the current scope, so answers already in flight for it are dropped. */
export const retirePermissionEpoch = (): void => {
  state.current += 1;
};
