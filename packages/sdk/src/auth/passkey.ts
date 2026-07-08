import {
  deleteAuthV1UsersCurrentPasskeysById,
  getAuthV1UsersCurrentPasskeys,
  patchAuthV1UsersCurrentPasskeysById,
  postAuthV1PasskeyLoginBegin,
  postAuthV1PasskeyLoginFinish,
  postAuthV1UsersCurrentPasskeysRegisterBegin,
  postAuthV1UsersCurrentPasskeysRegisterFinish,
  postAuthV1VerifyPasskey,
} from "../generated/sdk.gen";
import {setTokens} from "./authStore";
import {apiCall} from "./api/utils";
import {HTTP_STATUS} from "./constants";

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function decodeCreationOptions(raw: any): PublicKeyCredentialCreationOptions {
  const pk = raw.publicKey ?? raw;
  return {
    ...pk,
    challenge: base64urlToBuffer(pk.challenge),
    user: {...pk.user, id: base64urlToBuffer(pk.user.id)},
    excludeCredentials: (pk.excludeCredentials ?? []).map((c: any) => ({
      ...c,
      id: base64urlToBuffer(c.id),
    })),
  };
}

export function decodeRequestOptions(raw: any): PublicKeyCredentialRequestOptions {
  const pk = raw.publicKey ?? raw;
  return {
    ...pk,
    challenge: base64urlToBuffer(pk.challenge),
    allowCredentials: (pk.allowCredentials ?? []).map((c: any) => ({
      ...c,
      id: base64urlToBuffer(c.id),
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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

function serializeLoginCredential(cred: PublicKeyCredential): object {
  const response = cred.response as AuthenticatorAssertionResponse;
  return {
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
    },
  };
}

function serializeRegistrationCredential(cred: PublicKeyCredential): object {
  const response = cred.response as AuthenticatorAttestationResponse;
  return {
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      attestationObject: bufferToBase64url(response.attestationObject),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
    },
  };
}

export const finishPasskeyLogin = async (session_id: string, credential: PublicKeyCredential): Promise<void> => {
  return apiCall(
    async () => {
      const serialized = serializeLoginCredential(credential);

      const {data} = await postAuthV1PasskeyLoginFinish({
        // @ts-expect-error credential is json.RawMessage on server, not Array<number>
        body: {session_id, credential: serialized},
        throwOnError: true,
      });

      if (data.access_token && data.refresh_token && data.expires_in) {
        setTokens(data.access_token, data.refresh_token, data.expires_in);
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid passkey credential"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Passkey authentication failed"),
    }
  );
};

export const beginPasskeyLogin = async (): Promise<PasskeyBeginLogin> => {
  return apiCall(async () => {
    const {data} = await postAuthV1PasskeyLoginBegin({
      throwOnError: true,
    });

    if (!data.session_id || !data.options) {
      throw new Error("No passkeys available for this account");
    }

    const options = decodeRequestOptions(data.options);
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

      const options = decodeCreationOptions(data.options);
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
  credential: PublicKeyCredential
): Promise<PasskeyRegistrationResult> => {
  return apiCall(
    async () => {
      const serialized = serializeRegistrationCredential(credential);

      const {data} = await postAuthV1UsersCurrentPasskeysRegisterFinish({
        // @ts-expect-error credential is json.RawMessage on server, not Array<number>
        body: {session_id, name, credential: serialized},
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

export const verifyPasskeyForLogin = async (session_id: string, credential: PublicKeyCredential): Promise<void> => {
  return apiCall(
    async () => {
      const serialized = serializeLoginCredential(credential);

      const {data} = await postAuthV1VerifyPasskey({
        // @ts-expect-error credential is json.RawMessage on server, not Array<number>
        body: {session_id, credential: serialized},
        throwOnError: true,
      });

      if (data.access_token && data.refresh_token && data.expires_in) {
        setTokens(data.access_token, data.refresh_token, data.expires_in);
      }
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid passkey credential"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Passkey verification failed"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Session not found"),
    }
  );
};
