# @qeeqez/auth-lib-js

## [0.29.1](https://github.com/rixlhq/auth-lib-js/compare/auth-lib-core-v0.29.0...auth-lib-core-v0.29.1) (2026-04-30)

### Bug Fixes

- migrate auth packages to rixlhq scope ([2356a62](https://github.com/rixlhq/auth-lib-js/commit/2356a62f449beaa991bafacb7fc732083cd8747b))

## [0.29.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.28.0...auth-lib-core-v0.29.0) (2026-04-27)

### Features

- add subscription endpoint ([69e6837](https://github.com/qeeqez/auth-lib-js/commit/69e68374485d2a2223300f20b5ddade2c66a18bf))

## [0.28.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.27.2...auth-lib-core-v0.28.0) (2026-04-21)

### Features

- **core:** add subscribe_to_blog option to registerWithEmail ([490a42b](https://github.com/qeeqez/auth-lib-js/commit/490a42b411b16b99f3b8e02b7b5b46399584518f))

## [0.27.2](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.27.1...auth-lib-core-v0.27.2) (2026-04-10)

### Bug Fixes

- **core:** migrate ky client to v2 prefix API and normalize endpoints ([007136c](https://github.com/qeeqez/auth-lib-js/commit/007136cad78032271081bec4ffe41614f96844cc))
- test errors ([66f711c](https://github.com/qeeqez/auth-lib-js/commit/66f711cb9e6e9ca7f16989a4a893b94349c0b3ff))

## [0.27.1](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.27.0...auth-lib-core-v0.27.1) (2026-03-12)

### Bug Fixes

- login error handler ([f95568d](https://github.com/qeeqez/auth-lib-js/commit/f95568d698e787efa744af961558bf09d0281fa6))
- more lint errors ([c4f4b06](https://github.com/qeeqez/auth-lib-js/commit/c4f4b06f96bf438a4d660b1eeaf9ea9931e4cc86))
- run lint and fix errors ([89e1d9f](https://github.com/qeeqez/auth-lib-js/commit/89e1d9f884491e16ad1c2538b057214d5b00821d))

## [0.27.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.5...auth-lib-core-v0.27.0) (2026-03-05)

### Features

- **core:** migrate package build from vite to tsdown ([a685321](https://github.com/qeeqez/auth-lib-js/commit/a685321e75a74b677001823aba3440fe9a7702aa))

### Bug Fixes

- **core:** satisfy isolated declaration requirements ([63056fc](https://github.com/qeeqez/auth-lib-js/commit/63056fcea232ae7bbf2534bc3117f3f8719b15ee))

## [0.26.5](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.4...auth-lib-core-v0.26.5) (2026-03-04)

### Bug Fixes

- **ci:** setup automerge ([24bf4d1](https://github.com/qeeqez/auth-lib-js/commit/24bf4d13e8b81ab84e8d3f5abd3df8f7eb27ffc5))

## [0.26.4](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.3...auth-lib-core-v0.26.4) (2026-02-23)

### Bug Fixes

- username change error ([e27743a](https://github.com/qeeqez/auth-lib-js/commit/e27743a7ffe01c35d6bdf8f66ce04c068b91030e))

## [0.26.3](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.2...auth-lib-core-v0.26.3) (2026-02-23)

### Bug Fixes

- react-doctor warning ([f4bff46](https://github.com/qeeqez/auth-lib-js/commit/f4bff46906da7fbab929751c28a4d614b5dbe849))
- totp failed test ([385a6d8](https://github.com/qeeqez/auth-lib-js/commit/385a6d815e3e261fe552eb81750d3ade44a587eb))
- totp response mismatch ([9e78638](https://github.com/qeeqez/auth-lib-js/commit/9e78638abe353dd9e49cb0318fae4866d6888cba))

## [0.26.2](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.1...auth-lib-core-v0.26.2) (2026-02-08)

### Bug Fixes

- provider login error ([9980378](https://github.com/qeeqez/auth-lib-js/commit/998037887793c86529321c545dcd8ad0a51ffe43))

## [0.26.1](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.26.0...auth-lib-core-v0.26.1) (2026-02-05)

### Bug Fixes

- use proper Bearer capitalization in refresh token Authorization header ([a0b6e98](https://github.com/qeeqez/auth-lib-js/commit/a0b6e98250d95618ab2380534aad6e0c300ee730))

## [0.26.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.25.1...auth-lib-core-v0.26.0) (2026-02-05)

### Features

- **auth-lib:** add addEmail function for Telegram users ([b37f425](https://github.com/qeeqez/auth-lib-js/commit/b37f42567c32e0a22d1a7be18f32763bf053d5b1))
- **auth-lib:** add HTTP status codes for email verification ([b754399](https://github.com/qeeqez/auth-lib-js/commit/b754399e0d152fda1cc147fd32333d4a4a16353b))
- **auth-lib:** handle email verification errors in loginWithEmail ([3009127](https://github.com/qeeqez/auth-lib-js/commit/30091277b8b946803cde65c81915b31551803617))
- **auth-lib:** handle OAuth/Telegram login errors in init ([0708275](https://github.com/qeeqez/auth-lib-js/commit/07082759f73be7a625cd0e267f7cfdbb3a1081f4))
- **auth-lib:** handle token response in verifyEmailWithCode ([c238bf3](https://github.com/qeeqez/auth-lib-js/commit/c238bf3c378a47a1da50aa4b87c777d2fca62651))
- **auth-lib:** make resendEmailVerificationCode unauthenticated ([21c3a4a](https://github.com/qeeqez/auth-lib-js/commit/21c3a4ac8a6faa62a28a373aef0de90a29e04662))

### Bug Fixes

- data type mismatch ([a45b9bb](https://github.com/qeeqez/auth-lib-js/commit/a45b9bb8efe18175550ebad370da9ae6b1c202d3))
- email failed test ([a9e9143](https://github.com/qeeqez/auth-lib-js/commit/a9e9143c55480011d751eb4e8d4bd507a12eecc6))
- fix bugs ([fbbb34f](https://github.com/qeeqez/auth-lib-js/commit/fbbb34f3b80174afc7ebad2114d04a65c22385e9))
- remove dead code ([eee67c0](https://github.com/qeeqez/auth-lib-js/commit/eee67c079726da3afeca8f126f76513ef0af8e0b))

## [0.25.1](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.25.0...auth-lib-core-v0.25.1) (2026-01-31)

### Bug Fixes

- add missing prop to Member type ([d5ace89](https://github.com/qeeqez/auth-lib-js/commit/d5ace8968c5c497d2209e32edf8768a1901b429d))

## [0.25.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.24.2...auth-lib-core-v0.25.0) (2026-01-30)

### Features

- **auth:** Logout on expired refresh token ([ee5b8e8](https://github.com/qeeqez/auth-lib-js/commit/ee5b8e852b48c884d483917467f0655b7379f36b))
- OAuth 2.0 spec refresh token error handling [#86](https://github.com/qeeqez/auth-lib-js/issues/86)ewadnvp ([bbfddef](https://github.com/qeeqez/auth-lib-js/commit/bbfddef7135c28e4b1a9013379f4b52b13934f26))

### Bug Fixes

- api test [#86](https://github.com/qeeqez/auth-lib-js/issues/86)ewadnvp ([561aaed](https://github.com/qeeqez/auth-lib-js/commit/561aaeddff4ab7ccf003b2b90418d38c38ad780f))
- **core:** improve testability and coverage for client-core and authConfig ([d75ad5d](https://github.com/qeeqez/auth-lib-js/commit/d75ad5dab6161f1c8d581035f9a28d8ddeed5d48))

## [0.24.2](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.24.1...auth-lib-core-v0.24.2) (2026-01-26)

### Bug Fixes

- add email to User type and JWT decode mapping ([c676305](https://github.com/qeeqez/auth-lib-js/commit/c676305db95cbab4828d3d59f2a4430583c6ec17))

## [0.24.1](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.24.0...auth-lib-core-v0.24.1) (2026-01-24)

### Bug Fixes

- add new prop to DomainResponse ([63c4ba8](https://github.com/qeeqez/auth-lib-js/commit/63c4ba841d3f950003caaaf39985fe0ae6b884c1))

## [0.24.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.23.2...auth-lib-core-v0.24.0) (2026-01-23)

### Features

- **domain-managment:** add checkDomainVerification and updateAutoJoin functions ([b4cc29a](https://github.com/qeeqez/auth-lib-js/commit/b4cc29a68ac97788199622e13067f9528fb2a19d))
- **domain-managment:** add domain types and validation schemas ([4d5bad2](https://github.com/qeeqez/auth-lib-js/commit/4d5bad2c348fa2b762a70deeb1dd98702f0e3caa))
- **domain-managment:** add getDomainStatus and initiateDomainVerification functions ([524d5fc](https://github.com/qeeqez/auth-lib-js/commit/524d5fcd5f6aca57609f08f16ba03e322157904d))
- **domain-managment:** add removeDomain function and export all domain functions ([7cd89a6](https://github.com/qeeqez/auth-lib-js/commit/7cd89a6e4ceeb100d5e8ef880150bc2aba0628f1))

## [0.23.2](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.23.1...auth-lib-core-v0.23.2) (2026-01-16)

### Bug Fixes

- workaround for bun build and publish bug [#86](https://github.com/qeeqez/auth-lib-js/issues/86)ew7w5rb ([3c12afc](https://github.com/qeeqez/auth-lib-js/commit/3c12afc9473c722661f5335f5488280eaf27b180))

## [0.23.1](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.23.0...auth-lib-core-v0.23.1) (2026-01-13)

### Bug Fixes

- avoid test code duplicates ([80360de](https://github.com/qeeqez/auth-lib-js/commit/80360de4b7d5b354a1c0813fa9f6af3143047418))
- refactor tests to avoid repetitions ([5d0f9c5](https://github.com/qeeqez/auth-lib-js/commit/5d0f9c5e4084be802d9ca9ae863c087bb5eed001))
- refactor tests to avoid repetitions ([64d27c8](https://github.com/qeeqez/auth-lib-js/commit/64d27c8fd772ee2d5fa7f9af20e07bf97a0a4b1d))

## [0.23.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.22.0...auth-lib-core-v0.23.0) (2026-01-13)

### Features

- add \_\_rixl_auth prefix to OAuth state storage keys ([18b3544](https://github.com/qeeqez/auth-lib-js/commit/18b3544cccc48dcf38b226846c24c3df09cccce9))
- Add comprehensive test suite with vitest ([0b65699](https://github.com/qeeqez/auth-lib-js/commit/0b65699cf52b7209365877b3d4914d53237d0d70))
- add comprehensive tests for api/utils, url, and providers/oauth ([7ce4af7](https://github.com/qeeqez/auth-lib-js/commit/7ce4af71d1145e2ced4c3108149778ba3b58fb30))
- add comprehensive tests for membership and social modules ([fdc239a](https://github.com/qeeqez/auth-lib-js/commit/fdc239a5c68367e8d6757a53121a0ede59bbda97))
- add comprehensive tests for OAuth provider implementations ([02775ae](https://github.com/qeeqez/auth-lib-js/commit/02775ae2f74c1080d4af15d103790fb1d3216d2c))
- add comprehensive tests for validation-utils ([0ecf606](https://github.com/qeeqez/auth-lib-js/commit/0ecf60643761714be0de859f51d4a5dd8be5859f))
- Enhanced error handling and retry logic ([d2a857f](https://github.com/qeeqez/auth-lib-js/commit/d2a857f5dcd6f763570ff328eff896e05ffc7562))
- Migrate from jwt-decode to jose for JWT handling ([d6cb8ba](https://github.com/qeeqez/auth-lib-js/commit/d6cb8bae5508fd7433d7318ba633d3444dabe3f8))
- Replace native fetch with ky for robust HTTP requests ([1f4150e](https://github.com/qeeqez/auth-lib-js/commit/1f4150e9b7067e5f995717385168be33338fa630))
- Request Deduplication and Robust getToken ([779142e](https://github.com/qeeqez/auth-lib-js/commit/779142e94d691bc23c6f859c1ae42229a1415559))

### Bug Fixes

- add jsdom environment and guards to cookie and social state tests ([04d12c6](https://github.com/qeeqez/auth-lib-js/commit/04d12c6412c356627ae9b7e993de41fd53b0bb16))
- Add localStorage availability check in userStore ([77a4ea1](https://github.com/qeeqez/auth-lib-js/commit/77a4ea1c349fad02c8a6a7f5d777f670127f9f8a))
- Add window/document availability checks for SSR/test compatibility ([f26bade](https://github.com/qeeqez/auth-lib-js/commit/f26badef38dac3a0328a36ff107fc9f3be255781))
- adjust cookie tests for jsdom limitations ([b6a9690](https://github.com/qeeqez/auth-lib-js/commit/b6a9690b2c3b862629f84e86d2ce7831ab9d1c41))
- broken tests and typescript errors ([aaebd34](https://github.com/qeeqez/auth-lib-js/commit/aaebd344fff11b6c7831093415ab2ccb74e662c0))
- correct dts generation ([dd376a8](https://github.com/qeeqez/auth-lib-js/commit/dd376a88bc8b2e943eff62dd71247ca518fd99bf))
- remove broken mockHandleApiError calls from socialConnections tests ([8a6ce42](https://github.com/qeeqez/auth-lib-js/commit/8a6ce428951700bd16f8d785ae5571e65dda5fbc))
- remove leading slashes from all API endpoints for ky prefixUrl compatibility ([76ce5b7](https://github.com/qeeqez/auth-lib-js/commit/76ce5b76666ff9909ff0ec464e654186154766f1))
- remove unused imports in api/client.test.ts ([f57ae42](https://github.com/qeeqez/auth-lib-js/commit/f57ae426ac582dc60080511fd77bb2c39219368f))
- resolve all membership test timeouts ([6d5490c](https://github.com/qeeqez/auth-lib-js/commit/6d5490c1dc7670b0f91eb7f0359c8e8e22d274f2))
- resolve TypeScript errors in new tests ([662c19b](https://github.com/qeeqez/auth-lib-js/commit/662c19b1a327e2a35b6adb71b9dc245e867e351e))
- resolve vi.mocked issues in user and organization tests ([9e5f0c7](https://github.com/qeeqez/auth-lib-js/commit/9e5f0c7125979eac1905e29fb93248ff6a338a66))
- unskip and fix SSR cookie tests ([c211ebd](https://github.com/qeeqez/auth-lib-js/commit/c211ebd550fdd51fd770a39fced236a39449faea))

### Reverts

- restore original test structure for vitest coverage compatibility ([5febd0b](https://github.com/qeeqez/auth-lib-js/commit/5febd0b2e8777dd92c904ecb954d05dc4cb5f3f6))

## [0.22.0](https://github.com/qeeqez/auth-lib-js/compare/auth-lib-core-v0.21.0...auth-lib-core-v0.22.0) (2026-01-12)

### Features

- add \_\_rixl_auth prefix to OAuth state storage keys ([18b3544](https://github.com/qeeqez/auth-lib-js/commit/18b3544cccc48dcf38b226846c24c3df09cccce9))
- Add comprehensive test suite with vitest ([0b65699](https://github.com/qeeqez/auth-lib-js/commit/0b65699cf52b7209365877b3d4914d53237d0d70))
- add comprehensive tests for api/utils, url, and providers/oauth ([7ce4af7](https://github.com/qeeqez/auth-lib-js/commit/7ce4af71d1145e2ced4c3108149778ba3b58fb30))
- add comprehensive tests for membership and social modules ([fdc239a](https://github.com/qeeqez/auth-lib-js/commit/fdc239a5c68367e8d6757a53121a0ede59bbda97))
- add comprehensive tests for OAuth provider implementations ([02775ae](https://github.com/qeeqez/auth-lib-js/commit/02775ae2f74c1080d4af15d103790fb1d3216d2c))
- add comprehensive tests for validation-utils ([0ecf606](https://github.com/qeeqez/auth-lib-js/commit/0ecf60643761714be0de859f51d4a5dd8be5859f))
- Enhanced error handling and retry logic ([d2a857f](https://github.com/qeeqez/auth-lib-js/commit/d2a857f5dcd6f763570ff328eff896e05ffc7562))
- Migrate from jwt-decode to jose for JWT handling ([d6cb8ba](https://github.com/qeeqez/auth-lib-js/commit/d6cb8bae5508fd7433d7318ba633d3444dabe3f8))
- Replace native fetch with ky for robust HTTP requests ([1f4150e](https://github.com/qeeqez/auth-lib-js/commit/1f4150e9b7067e5f995717385168be33338fa630))
- Request Deduplication and Robust getToken ([779142e](https://github.com/qeeqez/auth-lib-js/commit/779142e94d691bc23c6f859c1ae42229a1415559))

### Bug Fixes

- add jsdom environment and guards to cookie and social state tests ([04d12c6](https://github.com/qeeqez/auth-lib-js/commit/04d12c6412c356627ae9b7e993de41fd53b0bb16))
- Add localStorage availability check in userStore ([77a4ea1](https://github.com/qeeqez/auth-lib-js/commit/77a4ea1c349fad02c8a6a7f5d777f670127f9f8a))
- Add window/document availability checks for SSR/test compatibility ([f26bade](https://github.com/qeeqez/auth-lib-js/commit/f26badef38dac3a0328a36ff107fc9f3be255781))
- adjust cookie tests for jsdom limitations ([b6a9690](https://github.com/qeeqez/auth-lib-js/commit/b6a9690b2c3b862629f84e86d2ce7831ab9d1c41))
- broken tests and typescript errors ([aaebd34](https://github.com/qeeqez/auth-lib-js/commit/aaebd344fff11b6c7831093415ab2ccb74e662c0))
- correct dts generation ([dd376a8](https://github.com/qeeqez/auth-lib-js/commit/dd376a88bc8b2e943eff62dd71247ca518fd99bf))
- remove broken mockHandleApiError calls from socialConnections tests ([8a6ce42](https://github.com/qeeqez/auth-lib-js/commit/8a6ce428951700bd16f8d785ae5571e65dda5fbc))
- remove leading slashes from all API endpoints for ky prefixUrl compatibility ([76ce5b7](https://github.com/qeeqez/auth-lib-js/commit/76ce5b76666ff9909ff0ec464e654186154766f1))
- remove unused imports in api/client.test.ts ([f57ae42](https://github.com/qeeqez/auth-lib-js/commit/f57ae426ac582dc60080511fd77bb2c39219368f))
- resolve all membership test timeouts ([6d5490c](https://github.com/qeeqez/auth-lib-js/commit/6d5490c1dc7670b0f91eb7f0359c8e8e22d274f2))
- resolve TypeScript errors in new tests ([662c19b](https://github.com/qeeqez/auth-lib-js/commit/662c19b1a327e2a35b6adb71b9dc245e867e351e))
- resolve vi.mocked issues in user and organization tests ([9e5f0c7](https://github.com/qeeqez/auth-lib-js/commit/9e5f0c7125979eac1905e29fb93248ff6a338a66))
- unskip and fix SSR cookie tests ([c211ebd](https://github.com/qeeqez/auth-lib-js/commit/c211ebd550fdd51fd770a39fced236a39449faea))

### Reverts

- restore original test structure for vitest coverage compatibility ([5febd0b](https://github.com/qeeqez/auth-lib-js/commit/5febd0b2e8777dd92c904ecb954d05dc4cb5f3f6))

## 0.21.0

### Minor Changes

- 18b3544: Use \_\_rixl as global prefix for all local and session storage

### Patch Changes

- 9bac76f: Fix type errors

## 0.20.1

### Patch Changes

- 76ce5b7: Fix issues with / slash error when using ky

## 0.20.0

### Minor Changes

- e22e9f7: Implement comprehensive test suite
- d6cb8ba: Migrate to Jose for JWT Decode
- 5d4318b: Do valibot validations
- 779142e: Request Deduplication and Robust getToken
  - Identical GET requests are now deduplicated, saving bandwidth.
  - Token refresh failures now correctly clear the session and propagate errors.

- 12df236: Refactor to avoid repetitions and make code cleaner

## 0.19.4

### Patch Changes

- dd376a8: Fix: correct dts generation

## 0.19.3

### Patch Changes

- eb71c77: Use bunfig.toml

## 0.19.2

### Patch Changes

- 6e5c0f7: Workaround for Changset + Bun bug

## 0.19.1

### Patch Changes

- 413ada5: Fix bun incorrect build

## 0.19.0

### Minor Changes

- 7591581: Build with Bun package manager

## 0.18.2

### Patch Changes

- ed03eb6: Update microsoft login implementation

## 0.18.1

### Patch Changes

- 4bda0c5: Update microsoft config

## 0.18.0

### Minor Changes

- 53c6711: Add microsoft login

## 0.17.1

### Patch Changes

- b3cf40a: Update publicRespondToInvitation

## 0.17.0

### Minor Changes

- d691a3d: Add public respond to invitation route"

## 0.16.0

### Minor Changes

- 116f048: Add Resend Member Invite route

## 0.15.7

### Patch Changes

- b02fab7: Bump dependencies

## 0.15.6

### Patch Changes

- 1b57325: Fix confirmPasswordReset

## 0.15.5

### Patch Changes

- eae5653: Update package.lock and confirmPasswordReset route

## 0.15.4

### Patch Changes

- db2ed60: Add password change routes

## 0.15.3

### Patch Changes

- a0289de: Update InitiateEmailVerification route
- 731980a: Fix getEmailVerification status and initiateEmailChange route

## 0.15.2

### Patch Changes

- f3b2aa0: Update resend route

## 0.15.1

### Patch Changes

- 8597441: Update
- 8597441: Update verifyEmailWithCode route

## 0.15.0

### Minor Changes

- e020546: Add email auth verification

### Patch Changes

- b760a05: Update lockfile

## 0.14.1

### Patch Changes

- 766c16f: Update verifyOTP

## 0.14.0

### Minor Changes

- 6882f08: Update loginWithEmail route and add verifyTOTPForLogin route

### Patch Changes

- 27523cd: Update VerifyTOTPForLogin route
- f7bda11: Fix Auth routes errors

## 0.13.1

### Patch Changes

- f954d37: Bump deps

## 0.13.0

### Minor Changes

- f6d46a9: update api routes
- 8bd3373: update api routes
- 2f7ae29: update api routes

## 0.12.4

### Patch Changes

- 54091d0: Update OTPStatus response

## 0.12.3

### Patch Changes

- 6f70bea: Fix pendingInvite function

## 0.12.2

### Patch Changes

- 86c0a10: Refactor TOTP functionalities

## 0.12.1

### Patch Changes

- eab8132: Restore leaveOrganization function

## 0.12.0

### Minor Changes

- dd68f52: TOTP routes
- 4bcf95e: TOTP routes

## 0.11.4

### Patch Changes

- 8828c65: Update type Common

## 0.11.3

### Patch Changes

- fda029b: Update Membership type

## 0.11.2

### Patch Changes

- 58f8c93: Fix pendingInvite Route

## 0.11.1

### Patch Changes

- b1fb9be: Add leaveOrganization function

## 0.11.0

### Minor Changes

- f55ffd8: Add Login / Register Routes

## 0.10.0

### Minor Changes

- 8755e16: Leave Org endpoint

## 0.9.2

### Patch Changes

- c533971: Delete redundant route

## 0.9.1

### Patch Changes

- 22935b4: Version 0.9.1
- 8daada6: Dependencies update

## 0.9.0

### Minor Changes

- 43b7010: Add active and pending memberships functions

## 0.8.1

### Patch Changes

- 9f60e10: Optimize bundle size for the library

## 0.8.0

### Minor Changes

- eed4e93: Updates

## 0.7.0

### Minor Changes

- c2d38bf: Add update user and org functions

## 0.6.0

### Minor Changes

- 9ab5917: Add update org info and update user info functions

### Patch Changes

- bd1cfd0: Added respondToInvitation

## 0.5.0

### Minor Changes

- 86df0fc: Add accept / decline membership

## 0.4.3

### Patch Changes

- 4a38f37: Bump dependencies

## 0.4.2

### Patch Changes

- 7febb46: Use better type names

## 0.4.1

### Patch Changes

- 7a6b821: Login function instead of manual url handling

## 0.4.0

### Minor Changes

- 0ea3421: Implement social connections
- 76293cf: Introduce social connections handling

### Patch Changes

- afe3f1d: Correct apple handling

## 0.3.2

### Patch Changes

- 55a6fb2: Do not add extra user on frontend

## 0.3.1

### Patch Changes

- fd2fc90: Implement member listing, invites, removes

## 0.3.0

### Minor Changes

- fab1d9b: Implement memberships

### Patch Changes

- 3431e07: Membership switching

## 0.2.2

### Patch Changes

- 47f9ac1: Show the error if any

## 0.2.1

### Patch Changes

- 4f7137d: Assume provider url is valid and user is ready to login

## 0.2.0

### Minor Changes

- a53b973: Implement Google Auth

## 0.1.6

### Patch Changes

- 461dc29: Assume that user is logged in when using miniapp

## 0.1.5

### Patch Changes

- 32dd9b1: Wait until init completes before calling any getToken instance

## 0.1.4

### Patch Changes

- 878563f: Prevent from parallel getToken calls. Only one fetch at a time allowed

## 0.1.3

### Patch Changes

- dceec14: Unify token endpoint

## 0.1.2

### Patch Changes

- 2a31b64: Fix response parsing

## 0.1.1

### Patch Changes

- f50cfd0: Proper url paths

## 0.1.0

### Minor Changes

- 0389099: First release
