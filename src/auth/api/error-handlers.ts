import {ApiError} from "./types";
export {ApiError};

/**
 * Helper to create error functions - reduces bundle size by reusing error creation logic
 */
export const err =
  (message: string): (() => Error) =>
  () =>
    new Error(message);

type CommonErrors = {
  unauthorized: () => Error;
  badRequest: () => Error;
  notFound: () => Error;
  conflict: () => Error;
  forbidden: () => Error;
  tooManyRequests: () => Error;
};

/** Reusable error handlers for common cases - reduces repetitive error messages */
export const commonErrors: CommonErrors = {
  unauthorized: err("User is not authorized"),
  badRequest: err("Bad request"),
  notFound: err("Not found"),
  conflict: err("Resource already exists"),
  forbidden: err("Forbidden"),
  tooManyRequests: err("Too many requests"),
};

/**
 * Standard error handler for API errors with custom status code handling
 */
export const handleApiError = (error: unknown, statusHandlers: Record<number, () => Error>): never => {
  if (error instanceof ApiError) {
    const handler = statusHandlers[error.status];
    if (handler) {
      throw new ApiError(handler().message, error.status, error.endpoint, error.data);
    }
    throw error;
  }
  throw error;
};
