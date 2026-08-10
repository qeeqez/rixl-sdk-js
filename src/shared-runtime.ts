/**
 * Cross-instance runtime state for the SDK.
 *
 * Every store and client in this package is module-level singleton state that
 * `connect()` mutates. That only works while exactly one copy of `@rixl/sdk`
 * is evaluated. Bundlers routinely break that assumption: Vite's dependency
 * pre-bundling, for example, inlines a private copy of the SDK into any
 * optimized dependency that imports it, so a consumer's `connect()` configures
 * one copy while a library's requests read another — with a wrong baseUrl and,
 * worse, no auth tokens.
 *
 * Anchoring the state to a `Symbol.for` key on `globalThis` makes every copy
 * resolve the same objects, so duplication becomes harmless instead of a
 * silent, hard-to-trace failure.
 */

const REGISTRY_KEY = Symbol.for("@rixl/sdk.runtime");

/** Bumped only if the shape below changes incompatibly. */
const STATE_VERSION = 1;

interface SharedRegistry {
  version: number;
  /** Number of times this module has been evaluated in the current realm. */
  copies: number;
  values: Map<string, unknown>;
}

type RegistryHost = typeof globalThis & {[REGISTRY_KEY]?: SharedRegistry};

function registry(): SharedRegistry {
  const host = globalThis as RegistryHost;
  const existing = host[REGISTRY_KEY];

  // A registry from an incompatible version cannot be merged safely; leaving it
  // in place would hand back values of the wrong shape, so start a fresh one.
  if (existing && existing.version === STATE_VERSION) {
    return existing;
  }

  const created: SharedRegistry = {version: STATE_VERSION, copies: 0, values: new Map()};
  host[REGISTRY_KEY] = created;
  return created;
}

/**
 * Returns the one shared value for `name`, creating it on first use.
 *
 * `create` runs at most once per realm no matter how many copies of the SDK are
 * loaded, so callers get object identity (a nanostore atom, a Set) rather than
 * a per-copy clone.
 */
export function shared<T>(name: string, create: () => T): T {
  const {values} = registry();
  if (!values.has(name)) {
    values.set(name, create());
  }
  return values.get(name) as T;
}

const copies = (registry().copies += 1);

if (copies > 1) {
  console.warn(
    `[@rixl/sdk] ${copies} copies of this package were loaded in one page. Shared state is deduplicated, so this is not fatal, ` +
      'but it doubles bundle size and usually means a bundler inlined a private copy — with Vite, add "@rixl/sdk" to ' +
      "optimizeDeps.include and resolve.dedupe. Ensure libraries depending on @rixl/sdk declare it as a peerDependency."
  );
}
