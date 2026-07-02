import {
  deleteAuthV1UsersCurrentPasskeysById,
  getAuthV1UsersCurrentPasskeys,
  patchAuthV1UsersCurrentPasskeysById,
  postAuthV1PasskeyLoginBegin,
  postAuthV1UsersCurrentPasskeysRegisterBegin,
  postAuthV1UsersCurrentPasskeysRegisterFinish,
} from "../generated/sdk.gen";
import {apiCall} from "./api/utils";
import {HTTP_STATUS} from "./constants";

export interface PasskeyBeginLogin {
  session_id: string;
  options: PublicKeyCredentialRequestOptions;
}

export interface PasskeyBeginRegistration {
  session_id: string;
  options: PublicKeyCredentialCreationOptions;
}

export interface PasskeyRegistrationResult {
  passkey_id: string;
  name: string;
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

export const beginPasskeyLogin = async (): Promise<PasskeyBeginLogin> => {
  return apiCall(async () => {
    const {data} = await postAuthV1PasskeyLoginBegin({
      throwOnError: true,
    });

    if (!data.session_id || !data.options) {
      throw new Error("Invalid response from server");
    }

    const decoded = new TextDecoder().decode(new Uint8Array(data.options));
    const options = JSON.parse(decoded) as PublicKeyCredentialRequestOptions;

    return {session_id: data.session_id, options};
  }, {});
};

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

export const finishPasskeyRegistration = async (
  session_id: string,
  name: string,
  credential: Credential
): Promise<PasskeyRegistrationResult> => {
  return apiCall(
    async () => {
      const encoded = Array.from(new TextEncoder().encode(JSON.stringify(credential)));

      const {data} = await postAuthV1UsersCurrentPasskeysRegisterFinish({
        body: {session_id, name, credential: encoded},
        throwOnError: true,
      });

      return {
        passkey_id: data.passkey_id ?? "",
        name: data.name ?? "",
      };
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid passkey credential"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Token is missing or invalid; user is not authenticated."),
    }
  );
};

export const renamePasskey = async (id: string, name: string): Promise<void> => {
  return apiCall(
    async () => {
      await patchAuthV1UsersCurrentPasskeysById({
        path: {id},
        body: {name},
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Passkey not found"),
    }
  );
};

export const deletePasskey = async (id: string): Promise<void> => {
  return apiCall(
    async () => {
      await deleteAuthV1UsersCurrentPasskeysById({
        path: {id},
        throwOnError: true,
      });
    },
    {
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Passkey not found"),
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
