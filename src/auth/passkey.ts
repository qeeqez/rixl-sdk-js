import {
  authV1PasskeyServiceDeletePasskey,
  authV1PasskeyServiceListPasskeys,
  authV1PasskeyServiceRenamePasskey,
  authV1PasskeyServicePasskeyLoginBegin,
  authV1PasskeyServicePasskeyLoginFinish,
  authV1PasskeyServicePasskeyRegisterBegin,
  authV1PasskeyServicePasskeyRegisterFinish,
  authV1PasskeyServiceVerifyPasskeyForLogin,
} from "../generated/sdk.gen";
import {apiCall} from "./api/utils";
import {persistTokens} from "./api/tokens";
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
// The gateway sends WebAuthn options as base64-encoded JSON (spec `format: byte`).
// Decode the envelope to an object before extracting the publicKey payload.
function parseOptionsEnvelope(raw: any): any {
  const decoded = typeof raw === "string" ? JSON.parse(atob(raw)) : raw;
  return decoded.publicKey ?? decoded;
}

function decodeCreationOptions(raw: any): PublicKeyCredentialCreationOptions {
  const pk = parseOptionsEnvelope(raw);
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
  const pk = parseOptionsEnvelope(raw);
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

// The server's `credential` field is `bytes` (spec `format: byte`), so the
// WebAuthn credential JSON must be sent as a base64-encoded string, not an object.
function encodeCredential(credential: object): string {
  return btoa(JSON.stringify(credential));
}

function serializeLoginCredential(cred: PublicKeyCredential): string {
  const response = cred.response as AuthenticatorAssertionResponse;
  return encodeCredential({
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      signature: bufferToBase64url(response.signature),
      userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
    },
  });
}

function serializeRegistrationCredential(cred: PublicKeyCredential): string {
  const response = cred.response as AuthenticatorAttestationResponse;
  return encodeCredential({
    id: cred.id,
    rawId: bufferToBase64url(cred.rawId),
    type: cred.type,
    response: {
      attestationObject: bufferToBase64url(response.attestationObject),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
    },
  });
}

export const finishPasskeyLogin = async (session_id: string, credential: PublicKeyCredential): Promise<void> => {
  return apiCall(
    async () => {
      const serialized = serializeLoginCredential(credential);

      const {data} = await authV1PasskeyServicePasskeyLoginFinish({
        body: {session_id, credential: serialized},
        throwOnError: true,
      });

      persistTokens(data);
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid passkey credential"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Passkey authentication failed"),
    }
  );
};

export const beginPasskeyLogin = async (): Promise<PasskeyBeginLogin> => {
  return apiCall(async () => {
    const {data} = await authV1PasskeyServicePasskeyLoginBegin({
      body: {},
      throwOnError: true,
    });

    const sessionId = data.session_id;
    if (!sessionId || !data.options) {
      throw new Error("No passkeys available for this account");
    }

    const options = decodeRequestOptions(data.options);
    return {session_id: sessionId, options};
  }, {});
};

export const beginPasskeyRegistration = async (): Promise<PasskeyBeginRegistration> => {
  return apiCall(
    async () => {
      const {data} = await authV1PasskeyServicePasskeyRegisterBegin({
        body: {},
        throwOnError: true,
      });

      const sessionId = data.session_id;
      if (!sessionId || !data.options) {
        throw new Error("Invalid response from server");
      }

      const options = decodeCreationOptions(data.options);
      return {session_id: sessionId, options};
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

      const {data} = await authV1PasskeyServicePasskeyRegisterFinish({
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
      await authV1PasskeyServiceRenamePasskey({
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
      await authV1PasskeyServiceDeletePasskey({
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
      const {data} = await authV1PasskeyServiceListPasskeys({
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

      const {data} = await authV1PasskeyServiceVerifyPasskeyForLogin({
        body: {session_id, credential: serialized},
        throwOnError: true,
      });

      persistTokens(data);
    },
    {
      [HTTP_STATUS.BAD_REQUEST]: () => new Error("Invalid passkey credential"),
      [HTTP_STATUS.UNAUTHORIZED]: () => new Error("Passkey verification failed"),
      [HTTP_STATUS.NOT_FOUND]: () => new Error("Session not found"),
    }
  );
};
