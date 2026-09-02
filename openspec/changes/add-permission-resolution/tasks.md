## 1. Stop discarding policies and permissions

- [x] 1.1 Add `policies: AuthV1Policy[]` and `permissions: string[]` to the `UserInfo` interface in `src/auth/user.ts`
- [x] 1.2 Map both fields in `getUserInfo`, defaulting to `[]`
- [x] 1.3 Update the two existing `getUserInfo` tests that assert the exact result shape
- [x] 1.4 Add a test covering a response that carries policies and permissions

## 2. Permission matcher

- [x] 2.1 Add `src/auth/permissions/matcher.ts` with `READ_VERBS`, `WRITE_VERBS` and a `SUPERSETS` map, reconciled to the registry's `read`/`write` only
- [x] 2.2 Implement `matches(held, required)` splitting on the **last** `:` so non-three-segment grammars still resolve
- [x] 2.3 Unit-test the matrix across all 12 registry resources: exact match, write-implies-read, read-does-not-imply-write, cross-resource, cross-service, empty set, no-separator input, and an unregistered verb failing closed

## 3. Permission store

- [x] 3.1 Add `src/auth/permissionStore.ts` exporting a `shared("permissions", …)` atom holding `ReadonlySet<string>`, defaulting to empty
- [x] 3.2 Add `hasPermission(required)` delegating to the matcher
- [x] 3.3 Add `clearPermissions()` resetting the atom
- [x] 3.4 Call `clearPermissions()` from `removeTokens()` in `src/auth/authStore.ts`
- [x] 3.5 Test initial state, subscriber notification, checks against the held set, and clearing

## 4. Resolution

- [x] 4.1 Add `src/auth/permissions/resolve.ts` with `resolvePermissions()` calling `getUserInfo()` — kept out of `permissionStore.ts` to avoid the `user.ts → api/tokens.ts → authStore.ts` import cycle
- [x] 4.2 Replace rather than merge, so revoked grants disappear
- [x] 4.3 Propagate request failure and leave the held set untouched
- [x] 4.4 Test both population paths, replacement semantics, and the failure case

## 5. Exports & build

- [x] 5.1 Export `permissions`, `resolvePermissions`, `hasPermission`, `clearPermissions`, `matchesPermission` and the verb constants from `src/auth/index.ts` and `src/index.ts`
- [x] 5.2 `bun run check` passes (format + lint, 164 files clean)
- [x] 5.3 `bunx vitest run` passes (833 tests, 76 files)
- [x] 5.4 `bun run build` succeeds and the new symbols are present in `dist/index.js` and `dist/index.d.ts`
- [x] 5.5 Confirm a consumer typechecks against the built surface (dashboard probe: `tsc --noEmit` clean)
- [ ] 5.6 Bump the minor version — `UserInfo` gains two required fields, which is breaking for anyone constructing the literal

## 7. Scope-change correctness (found in live testing)

- [x] 7.1 Add `invalidatePermissions()` and an epoch guard so a response issued before an organization switch cannot repopulate the store afterwards
- [x] 7.2 Stop `resolvePermissions` sharing one in-flight promise — a caller asking for a refresh was being handed the previous scope's request. Deduplication now lives only in `ensurePermissions`
- [x] 7.3 Document that a caller changing scope must `clearPermissions()` first, so a failed resolution denies rather than retaining stale grants
- [x] 7.4 Test a late stale response being discarded, a newer answer surviving one, and re-resolution after invalidation

## 6. Backend confirmation (tracked, not blocking)

- [x] 6.1 Confirm where effective permissions come from — `auth.v1.UserInfo` via `GET /auth/v1/userinfo`, carrying both `policies` and `permissions`
- [x] 6.2 Call `ListPermissionRegistry` against a live org and record the actual permission names — 27 reported, 25 returned; capability map and matcher reconciled
- [ ] 6.3 Confirm whether roles (`OWNER`/`ADMIN`) are flattened into the resolved permission set server-side, or must be composed client-side
- [ ] 6.4 Confirm the `types` query parameter on `ListPermissionRegistry` — if it partitions permissions into categories, it should inform the capability grouping
- [ ] 6.5 Retrieve the two permissions the registry reports but does not return (`total: 27`, 25 returned), and record whether either governs analytics authoring or support
