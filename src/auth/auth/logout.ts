import {postAuthV1Logout} from "../../generated/sdk.gen";
import {removeTokens} from "../authStore";

export const logout = async (): Promise<void> => {
  try {
    await postAuthV1Logout({throwOnError: true});
  } catch {
    // Revocation failed — still clear local state
  } finally {
    removeTokens();
  }
};
