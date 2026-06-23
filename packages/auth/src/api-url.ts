import { atom, type WritableAtom } from "nanostores";

/**
 * Global API base URL store
 */
export const apiURL: WritableAtom<string> = atom("");
