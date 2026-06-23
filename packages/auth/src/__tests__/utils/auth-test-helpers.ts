/**
 * Shared test utilities for authentication tests
 * Provides reusable mock setup and common test patterns
 */

import { vi } from "vitest";
import * as authStore from "../../authStore";
import * as initialization from "../../initialization";

/**
 * Sets up common mocks for auth tests
 */
const setupAuthMocks = () => {
  const setTokensSpy = vi.spyOn(authStore, "setTokens").mockImplementation(() => {});
  const getTokenSpy = vi.spyOn(authStore, "getToken").mockResolvedValue("mock-token");

  return { setTokensSpy, getTokenSpy };
};

/**
 * Cleans up auth mocks
 */
export const cleanupAuthMocks = (mocks: { setTokensSpy?: any; getTokenSpy?: any }) => {
  mocks.setTokensSpy?.mockRestore();
  mocks.getTokenSpy?.mockRestore();
};

/**
 * Common beforeEach setup for auth tests
 */
export const setupAuthTest = () => {
  vi.clearAllMocks();
  initialization.initDeferred.promise = Promise.resolve();
  return setupAuthMocks();
};
