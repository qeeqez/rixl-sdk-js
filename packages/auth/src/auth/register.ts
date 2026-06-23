import { publicFetch } from "../api/fetchers";
import { validateInput } from "../validation/base";
import { EmailAuthRequestSchema, ResendEmailRequestSchema } from "../validation/auth";
import { apiCall } from "../api/utils";
import { HTTP_STATUS } from "../constants";
import { RegistrationResponse } from "./types";

/**
 * Registers a new user with email and password
 * @param email User's email address
 * @param password User's password (must be at least 8 characters)
 * @param subscribeToBlog Whether to subscribe the user to blog updates
 * @returns A promise that resolves when registration is successful
 * @throws Error if registration fails (email exists, password too short, etc.)
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  subscribeToBlog?: boolean,
): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(EmailAuthRequestSchema, {
        email,
        password,
        subscribe_to_blog: subscribeToBlog,
      });
      return await publicFetch<RegistrationResponse>("auth/register", {
        method: "POST",
        body: validatedInput,
      });
    },
    {
      [HTTP_STATUS.CONFLICT]: () => new Error("Email address is already registered"),
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Password is too short (minimum 8 characters)"),
    },
  );
};

/**
 * Resends the email verification code to the user's email address
 * @param email User's email address
 * @returns A promise that resolves when the email verification code is resent
 * @throws Error if the email verification code is not resent (invalid email, user not found, rate limit exceeded, etc.)
 */
export const resendEmailVerificationCode = async (
  email: string,
): Promise<void | RegistrationResponse> => {
  return apiCall(
    async () => {
      const validatedInput = validateInput(ResendEmailRequestSchema, { email });
      return await publicFetch<RegistrationResponse>("auth/email/verify/resend", {
        method: "POST",
        body: validatedInput,
      });
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Bad request - invalid email or validation error"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("User not found with the provided email"),
      [HTTP_STATUS.TOO_MANY_REQUESTS]: () => new Error("Too many requests - rate limit exceeded"),
    },
  );
};
