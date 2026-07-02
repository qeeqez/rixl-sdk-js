import {getAuthV1UsersCurrentPasskeys, postAuthV1UsersCurrentPasskeysRegisterBegin} from "../generated/sdk.gen";
import {apiCall} from "./api/utils";
import {HTTP_STATUS} from "./constants";

export interface PasskeyBeginRegistration {
  session_id: string;
  options: PublicKeyCredentialCreationOptions;
}

export interface Passkey {
  id: string;
  name: string;
  credential_id: string;
  aaguid: string;
  backup_state: boolean;
  created_at: string;
  last_used_at: string;
  transports: string[];
}

export const beginPasskeyRegistration = async (): Promise<PasskeyBeginRegistration> => {
  return apiCall(
    async () => {
      const {data} = await postAuthV1UsersCurrentPasskeysRegisterBegin({
        throwOnError: true,
      });

      if (!data.session_id || !data.options) {
        throw new Error("Invalid response from server");
      }

      const decoded = new TextDecoder().decode(new Uint8Array(data.options));
      const options = JSON.parse(decoded) as PublicKeyCredentialCreationOptions;

      return {session_id: data.session_id, options};
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

export const listPasskeys = async (): Promise<Passkey[]> => {
  return apiCall(
    async () => {
      const {data} = await getAuthV1UsersCurrentPasskeys({
        throwOnError: true,
      });

      return (data.passkeys ?? []).map((p) => ({
        id: p.id ?? "",
        name: p.name ?? "",
        credential_id: p.credential_id ?? "",
        aaguid: p.aaguid ?? "",
        backup_state: p.backup_state ?? false,
        created_at: p.created_at ?? "",
        last_used_at: p.last_used_at ?? "",
        transports: p.transports ?? [],
      }));
    },
    {
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};
