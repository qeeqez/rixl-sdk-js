# Rixl SDK examples

Runnable TypeScript examples for `@rixl/sdk`, the Rixl API SDK generated with [Hey API](https://heyapi.dev/).

Each example is a small, self-contained script. The client is constructed inline and the Hey API `{ data, error, response }` result tuple is handled inline — copy any example into your own project and it will work with minimal edits.

## Setup

Build the local package entrypoint before running examples from this repository:

```bash
vp install
vp pack
```

Set a Rixl API key:

```bash
export RIXL_API_KEY="rk_..."
```

## Base URL

> **Examples target production (`https://api.rixl.com/`) by default.** Destructive examples will hit your real account unless you override the base URL.

To target another environment:

```bash
export RIXL_BASE_URL="https://api.staging.rixl.com/"
```

## Destructive operations

Examples that delete or replace existing resources refuse to run unless you opt in:

```bash
export RIXL_RUN_DESTRUCTIVE=1
```

Without this flag the destructive code paths throw a clear error and exit.

## Available examples

```bash
bun examples/01-client-setup.ts
```

## Typecheck

```bash
bun run examples:check
```
