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

  return { promise, resolve, reject };
}

/**
 * Global deferred promise that tracks the initialization status of the auth library
 * This is resolved when initClient is called
 */
export const initDeferred: Deferred = createDeferred();
