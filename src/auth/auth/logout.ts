import {authV1TokenServiceLogout} from "../../generated/sdk.gen";
import {refreshToken, removeTokens} from "../authStore";

export const logout = async (): Promise<void> => {
  try {
    await authV1TokenServiceLogout({body: {token: refreshToken.get()}, throwOnError: true});
  } catch {
    // Revocation failed — still clear local state
  } finally {
    removeTokens();
  }
};
