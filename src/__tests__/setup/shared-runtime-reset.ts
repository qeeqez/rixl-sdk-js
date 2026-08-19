const RUNTIME_KEY = Symbol.for("@rixl/sdk.runtime");

/**
 * Drops the cross-copy registry so the next `shared()` call builds a fresh value.
 *
 * Production deliberately keeps one set of stores per realm — that is what makes
 * duplicate copies of the package converge. Unit tests that construct their own
 * stores need the opposite, so they reset the registry between cases.
 */
export const resetSharedRuntime = (): void => {
  Reflect.deleteProperty(globalThis, RUNTIME_KEY);
};
