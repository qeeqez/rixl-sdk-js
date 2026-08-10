import {atom, type WritableAtom} from "nanostores";
import {GLOBAL_PREFIX} from "./constants";
import type {User} from "./types";
import {shared} from "../shared-runtime";

const userPath = GLOBAL_PREFIX + "_user";
const parseUser = (): User | undefined => {
  // Check if localStorage is available and has proper methods (e.g., in test environments)
  if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.getItem !== "function") {
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

// Created inside the shared factory so the persistence subscription is attached
// exactly once per realm, even if several copies of this package are loaded.
export const user: WritableAtom<User | undefined> = shared("user", () => {
  const store = atom<User | undefined>(parseUser());

  store.subscribe((value) => {
    // Check if localStorage is available and has proper methods
    if (typeof localStorage === "undefined" || !localStorage || typeof localStorage.setItem !== "function") {
      return;
    }

    if (value) {
      localStorage.setItem(userPath, JSON.stringify(value));
    } else {
      localStorage.removeItem(userPath);
    }
  });

  return store;
});
