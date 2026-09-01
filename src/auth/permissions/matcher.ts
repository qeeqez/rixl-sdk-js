/**
 * Permission strings follow a `service:resource:action` grammar, e.g.
 * `media:videos:read`. Only the trailing action segment carries the verb, so
 * matching splits on the *last* separator — a two- or four-segment grammar
 * still resolves correctly if the registry turns out to differ.
 */

export const READ_VERBS = ["read"] as const;

export const WRITE_VERBS = ["write"] as const;

/**
 * Verbs that satisfy a required verb on the same resource.
 *
 * The registry grants only `read` and `write`, and write implies read: being
 * able to change a video implies being able to see it. An unlisted verb is
 * satisfied only by an exact match, so a verb the registry adds later fails
 * closed until it is added here.
 */
const SUPERSETS: Readonly<Record<string, readonly string[]>> = {
  read: ["write"],
};

/**
 * Whether the held permission set satisfies `required`.
 *
 * A permission with no verb separator is matched exactly — an unrecognized
 * shape must never widen access.
 */
export const matches = (held: ReadonlySet<string>, required: string): boolean => {
  if (held.has(required)) return true;

  const separator = required.lastIndexOf(":");
  if (separator < 0) return false;

  const resource = required.slice(0, separator + 1);
  const verb = required.slice(separator + 1);

  return (SUPERSETS[verb] ?? []).some((superset) => held.has(resource + superset));
};
