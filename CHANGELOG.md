# Changelog

## [0.4.1](https://github.com/rixlhq/rixl-js/compare/sdk-v0.5.0...sdk-v0.4.1) (2026-07-08)


### Features

* add example scripts and auth providers for RIXL API ([a4b9670](https://github.com/rixlhq/rixl-js/commit/a4b967010f3110a025e4c016495962fe8f783de2))
* add LICENSE file and update package.json to include license info ([b95c5fa](https://github.com/rixlhq/rixl-js/commit/b95c5fa09bfd656df06e103903d4728cbb5136e0))
* add sdk [#86](https://github.com/rixlhq/rixl-js/issues/86)ewyy49g ([f229df7](https://github.com/rixlhq/rixl-js/commit/f229df79b591975f90662d95e1f6f25e9bbd494e))
* consolidate typescript sdk into js sdk ([ec5a68d](https://github.com/rixlhq/rixl-js/commit/ec5a68df3b22d90160343d0b38c14e9478244e1e))
* finish adding auth to sdk ([aa9adf2](https://github.com/rixlhq/rixl-js/commit/aa9adf286affc8f19ed3b1e736c2ba623ca9fcd3))
* generate SDK with hey api gen ([c280a92](https://github.com/rixlhq/rixl-js/commit/c280a92e89d1c49868bc221883f543993fa5cb2a))
* get rid of kiota sdk ([0761ec7](https://github.com/rixlhq/rixl-js/commit/0761ec733487a44908bd07510f1e4d07633cc4b4))
* introduce @rixl/sdk package (renamed from @rixl/rixl) ([60598e6](https://github.com/rixlhq/rixl-js/commit/60598e6c79644c9b4867045b9c6b0323ddf16e46))
* package name is "rixl" ([0e4cb34](https://github.com/rixlhq/rixl-js/commit/0e4cb348a840c16099949b4b4f265d3542996fc1))
* **repo:** add @rixlhq/auth-lib-react as packages/react ([15327eb](https://github.com/rixlhq/rixl-js/commit/15327eb35c21e685d9c2a9aa0318c8fcec916261))
* **repo:** wire workspace deps, tooling, and shared SDK client with token interceptor ([6a6491f](https://github.com/rixlhq/rixl-js/commit/6a6491ffbbd8ec6997f04163b3363f797e1c44ed))
* restructure examples ([cdf2605](https://github.com/rixlhq/rixl-js/commit/cdf2605b70fb7bfbbd2129cee8f9f5cca2a021cf))
* **sdk:** add auth runtime dependencies ([2a9ef5e](https://github.com/rixlhq/rixl-js/commit/2a9ef5e6bd6acdb464a0d08716eb42ddaa1b61b9))
* **sdk:** add beginPasskeyLogin function ([cce04ec](https://github.com/rixlhq/rixl-js/commit/cce04ec4b6d878393a4b64849666663c8b317378))
* **sdk:** add beginPasskeyRegistration function ([12f04d1](https://github.com/rixlhq/rixl-js/commit/12f04d1c52d9004027478b5718306a783ddcac9d))
* **sdk:** add deletePasskey function ([a31c0a7](https://github.com/rixlhq/rixl-js/commit/a31c0a7766a0efbd19f984b97abb7d7d57c88575))
* **sdk:** add finishPasskeyRegistration function ([a7a83de](https://github.com/rixlhq/rixl-js/commit/a7a83de6521f70f8f6eaecba3ea79b0df345320d))
* **sdk:** add listPasskeys function for passkey management ([4590a8c](https://github.com/rixlhq/rixl-js/commit/4590a8c7ad2cd2bf78270a235989c3b5238ccbba))
* **sdk:** add renamePasskey function ([6529643](https://github.com/rixlhq/rixl-js/commit/6529643db65b83dd8e8fd3beb0a482651dee451b))
* **sdk:** curate public surface, hide internal billing ops ([0c40481](https://github.com/rixlhq/rixl-js/commit/0c4048195e0ddc2cc317a748615d52617e9dc754))
* **sdk:** regenerate @rixl/sdk from RIXL API Gateway spec ([73c2059](https://github.com/rixlhq/rixl-js/commit/73c2059a682d83c93b0a2c0b6d888a811bfb66af))
* **sdk:** regenerate based on latest OpenAPI spec ([b7060b5](https://github.com/rixlhq/rixl-js/commit/b7060b5ea50f93eb86be7b9fa0a7289aec79c53a))
* **sdk:** regenerate based on latest OpenAPI spec ([e0cc5ed](https://github.com/rixlhq/rixl-js/commit/e0cc5edd91455e5043c63957e308985823941cd1))


### Bug Fixes

* align release workflow with videosdk (OIDC & Node 25) ([d01d940](https://github.com/rixlhq/rixl-js/commit/d01d94004d9929f9eee7ba89f0839cd92ebd21f1))
* **auth:** align auth function schemas with updated swagger spec ([97455ed](https://github.com/rixlhq/rixl-js/commit/97455edc5e6353661ea89f09ad635e975cb259a8))
* **auth:** align SDK call schemas with swagger definitions ([f2f552d](https://github.com/rixlhq/rixl-js/commit/f2f552dd0000698000a5210e651dcc3f5ca3803a))
* bump sdk version to 0.2.0 ([8245cf2](https://github.com/rixlhq/rixl-js/commit/8245cf2898e78ca28c4546047b5dc58918ca6b75))
* do not format automatically after hey gen ([84e74e6](https://github.com/rixlhq/rixl-js/commit/84e74e63d5d17561e9df7b0a47c218442b476b3b))
* drop skip-github-release — also skips the tag/publish flow ([3ad815b](https://github.com/rixlhq/rixl-js/commit/3ad815b8d769744abce86ca4c50e43d87ed4bdfc))
* fix build error ([03991c4](https://github.com/rixlhq/rixl-js/commit/03991c4d1af8994dfe036d6e58c35cef037b0fc7))
* minimal supported node version is Node 22 LTS release ([f4341eb](https://github.com/rixlhq/rixl-js/commit/f4341eb1db1b0c151a1a348239dbe5918703b47c))
* passkey ([f157803](https://github.com/rixlhq/rixl-js/commit/f1578038700e46cf15f1f6a00571036b66994946))
* proper release please setup ([cdc508d](https://github.com/rixlhq/rixl-js/commit/cdc508d92b37db5d8e2c69b4b45d979250275295))
* regenerated sdk ([10de668](https://github.com/rixlhq/rixl-js/commit/10de6681db9db3a004935272975c3c99e9e0b2cf))
* **release:** proper command for release ([02ad23b](https://github.com/rixlhq/rixl-js/commit/02ad23b367409f39d5423951cf262fb20f399635))
* **sdk:** add type modifiers to auth imports for rolldown compatibility ([d99a39a](https://github.com/rixlhq/rixl-js/commit/d99a39a9316c9da80d4aac5d39a61d56de874eb7))
* **sdk:** release public createClient export ([86233bc](https://github.com/rixlhq/rixl-js/commit/86233bc89700cfcbf8ef1fb2e0b0e2755c1d260a))
* switch to bun for building ([34f1bd1](https://github.com/rixlhq/rixl-js/commit/34f1bd16724b4e1636cacfbd2b7e790930fae90c))
* track sdk/ in release-please and force sequential patch bumps in pre-1.0 ([7e3dcb1](https://github.com/rixlhq/rixl-js/commit/7e3dcb164cd139311bcd804fc54182e7862bb0e5))
* update package name in README to reflect correct sdk version ([7c69e53](https://github.com/rixlhq/rixl-js/commit/7c69e53e4fead00d860c44b5422e74448b184525))
* update package name to @rixl/js ([7a19e78](https://github.com/rixlhq/rixl-js/commit/7a19e784c791007d2090ee42806247f350ab95cc))
* updated readme for hey generator ([ba82766](https://github.com/rixlhq/rixl-js/commit/ba82766254983163feeade232f685ba25353ada0))
* upgrade actions to avoid node 20 deprecation ([42febc6](https://github.com/rixlhq/rixl-js/commit/42febc62f9171fcecbdb6eba5ef0751ddf1b4b1b))
* use NPM_TOKEN secret for publishing ([19c4af8](https://github.com/rixlhq/rixl-js/commit/19c4af8d26ae91ec4403998d6d9b239eb90d62b9))
* use the right input for sdk gen ([d27c77f](https://github.com/rixlhq/rixl-js/commit/d27c77f29de2a264ddfdee8db49013efac8919be))

## [0.4.1](https://github.com/rixlhq/rixl-js/compare/v0.4.0...v0.4.1) (2026-05-07)

### Bug Fixes

- **sdk:** release public createClient export ([86233bc](https://github.com/rixlhq/rixl-js/commit/86233bc89700cfcbf8ef1fb2e0b0e2755c1d260a))

## [0.4.0](https://github.com/rixlhq/rixl-js/compare/v0.3.0...v0.4.0) (2026-05-07)

### Features

- **sdk:** regenerate based on latest OpenAPI spec ([b7060b5](https://github.com/rixlhq/rixl-js/commit/b7060b5ea50f93eb86be7b9fa0a7289aec79c53a))

### Bug Fixes

- minimal supported node version is Node 22 LTS release ([f4341eb](https://github.com/rixlhq/rixl-js/commit/f4341eb1db1b0c151a1a348239dbe5918703b47c))

## [0.3.0](https://github.com/rixlhq/rixl-js/compare/v0.2.2...v0.3.0) (2026-05-06)

### Features

- **sdk:** regenerate based on latest OpenAPI spec ([e0cc5ed](https://github.com/rixlhq/rixl-js/commit/e0cc5edd91455e5043c63957e308985823941cd1))

### Bug Fixes

- do not format automatically after hey gen ([84e74e6](https://github.com/rixlhq/rixl-js/commit/84e74e63d5d17561e9df7b0a47c218442b476b3b))

## [0.2.2](https://github.com/rixlhq/rixl-js/compare/v0.2.1...v0.2.2) (2026-05-06)

### Bug Fixes

- proper release please setup ([cdc508d](https://github.com/rixlhq/rixl-js/commit/cdc508d92b37db5d8e2c69b4b45d979250275295))
- updated readme for hey generator ([ba82766](https://github.com/rixlhq/rixl-js/commit/ba82766254983163feeade232f685ba25353ada0))

## [0.2.1](https://github.com/rixlhq/rixl-js/compare/v0.2.0...v0.2.1) (2026-05-06)

### Features

- add LICENSE file and update package.json to include license info ([b95c5fa](https://github.com/rixlhq/rixl-js/commit/b95c5fa09bfd656df06e103903d4728cbb5136e0))
- add sdk [#86](https://github.com/rixlhq/rixl-js/issues/86)ewyy49g ([f229df7](https://github.com/rixlhq/rixl-js/commit/f229df79b591975f90662d95e1f6f25e9bbd494e))
- consolidate typescript sdk into js sdk ([ec5a68d](https://github.com/rixlhq/rixl-js/commit/ec5a68df3b22d90160343d0b38c14e9478244e1e))
- get rid of kiota sdk ([0761ec7](https://github.com/rixlhq/rixl-js/commit/0761ec733487a44908bd07510f1e4d07633cc4b4))
- introduce @rixl/sdk package (renamed from @rixl/rixl) ([60598e6](https://github.com/rixlhq/rixl-js/commit/60598e6c79644c9b4867045b9c6b0323ddf16e46))
- package name is "rixl" ([0e4cb34](https://github.com/rixlhq/rixl-js/commit/0e4cb348a840c16099949b4b4f265d3542996fc1))
