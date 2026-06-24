export const getAllCookiesStartWith = (startWithKey: string): Partial<Record<string, string>> => {
  // Check if document is available (not in test/SSR environment)
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie
    .split(";")
    .map((cv) => cv.split("=").map((v) => v.trim()))
    .filter(([key]) => key && key !== startWithKey && key.startsWith(startWithKey))
    .reduce(
      (ac, [key, value]) => Object.assign(ac, { [key!.slice(startWithKey.length + 1)]: value }),
      {},
    );
};

import type { CookieSameSite } from "../types";

interface CookieAttributes {
  expires?: number | Date | undefined;
  path?: string | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
  sameSite?: CookieSameSite;
}

export function setCookie(name: string, value: string, options?: CookieAttributes): void {
  // Check if document is available
  if (typeof document === "undefined") {
    return;
  }

  let cookieString = `${encodeName(name)}=${encodeValue(value)}`;

  if (options) {
    if (options.expires) {
      if (typeof options.expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    if (options.secure) {
      cookieString += `; secure`;
    }
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
  }

  // Set the cookie
  document.cookie = cookieString;
}

// Function to delete a cookie
export function deleteCookie(name: string): void {
  // Check if document is available
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const encodeName = (name: string) =>
  encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent);

const encodeValue = (value: string) =>
  encodeURIComponent(value as string).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent,
  );
