import { initDeferred } from "../initialization";
import { handleApiError } from "./error-handlers";

/**
 * Generic helper for API calls to handle initialization and error handling
 * @param fn The async function to execute
 * @param errorMap A map of status codes to error functions
 * @returns The result of the function execution
 */
export const apiCall = async <T>(
  fn: () => Promise<T>,
  errorMap: Record<number, () => Error> = {},
): Promise<T> => {
  await initDeferred.promise;

  try {
    return await fn();
  } catch (error) {
    return handleApiError(error, errorMap);
  }
};
