import {shared} from "../shared-runtime";

/**
 * Interface for a deferred promise that can be resolved or rejected externally
 */
export interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason?: unknown) => void;
}

/**
 * Creates a deferred promise that can be resolved or rejected externally
 * @returns A deferred promise object
 */
export function createDeferred(): Deferred {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {promise, resolve, reject};
}

/**
 * Global deferred promise that tracks the initialization status of the auth library.
 * This is resolved when initClient is called.
 *
 * Shared across copies of this package. `connect()` runs in exactly one copy, so
 * a per-copy deferred leaves every other copy awaiting a promise nothing will
 * ever resolve — and because getToken() and the request interceptor both await
 * it, that is not a slow path but a permanent hang.
 */
export const initDeferred: Deferred = shared("initDeferred", createDeferred);
