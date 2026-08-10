import {atom, type WritableAtom} from "nanostores";
import {shared} from "../shared-runtime";

/**
 * Global API base URL store
 */
export const apiURL: WritableAtom<string> = shared("apiURL", () => atom(""));
