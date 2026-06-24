import { atom, type WritableAtom } from "nanostores";
import { GLOBAL_PREFIX } from "./constants";
import type { User } from "./types";

const userPath = GLOBAL_PREFIX + "_user";
const parseUser = (): User | undefined => {
  // Check if localStorage is available and has proper methods (e.g., in test environments)
  if (
    typeof localStorage === "undefined" ||
    !localStorage ||
    typeof localStorage.getItem !== "function"
  ) {
    return undefined;
  }

  const value = localStorage.getItem(userPath);
  if (value && value != "undefined") {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.warn("Can't parse user data, error: ", err);
      return undefined;
    }
  }
  return undefined;
};

export const user: WritableAtom<User | undefined> = atom<User | undefined>(parseUser());
user.subscribe((value) => {
  // Check if localStorage is available and has proper methods
  if (
    typeof localStorage === "undefined" ||
    !localStorage ||
    typeof localStorage.setItem !== "function"
  ) {
    return;
  }

  if (value) {
    localStorage.setItem(userPath, JSON.stringify(value));
  } else {
    localStorage.removeItem(userPath);
  }
});
