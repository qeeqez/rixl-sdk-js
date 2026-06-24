let loginRedirectUrl: string | undefined;

export const setLoginRedirectUrl = (url?: string): void => {
  loginRedirectUrl = url;
};

export const redirectToLogin = (): void => {
  if (!loginRedirectUrl) return;
  if (typeof window === "undefined") return;

  window.location.href = loginRedirectUrl;
};
