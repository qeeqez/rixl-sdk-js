import {authV1TokenServiceLogout} from "../../generated/sdk.gen";
import {removeTokens} from "../authStore";

export const logout = async (): Promise<void> => {
  try {
    await authV1TokenServiceLogout({body: {}, throwOnError: true});
  } catch {
    // Revocation failed — still clear local state
  } finally {
    removeTokens();
  }
};
