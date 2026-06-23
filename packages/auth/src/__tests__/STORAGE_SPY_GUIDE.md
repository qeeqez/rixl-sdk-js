# localStorage/sessionStorage Spy Testing Guide

## Overview

Our test setup now uses Vitest spies for `localStorage` and `sessionStorage`, providing better introspection and testing capabilities.

## Benefits

1. **Introspection**: See what methods were called with what parameters
2. **Call Tracking**: Verify call counts and order
3. **Mock Returns**: Mock specific return values for error scenarios
4. **Maintainable**: Cleaner, more readable test code

## Setup

The `vitest.setup.ts` file automatically creates spy-able storage mocks:

```typescript
const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    // ... other methods
  };
};
```

## Usage Examples

### Basic Tracking

```typescript
it("should track localStorage operations", () => {
  // Perform operations
  localStorage.setItem("token", "abc123");
  const token = localStorage.getItem("token");

  // Verify with spies
  expect(localStorage.setItem).toHaveBeenCalledWith("token", "abc123");
  expect(localStorage.getItem).toHaveBeenCalledWith("token");
  expect(token).toBe("abc123");
});
```

### Verify Call Counts

```typescript
it("should count method calls", () => {
  localStorage.setItem("key1", "value1");
  localStorage.setItem("key2", "value2");
  localStorage.getItem("key1");
  localStorage.removeItem("key2");

  expect(localStorage.setItem).toHaveBeenCalledTimes(2);
  expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
});
```

### Check Call Order

```typescript
it("should verify operation order", () => {
  localStorage.setItem("first", "value1");
  localStorage.setItem("second", "value2");

  const calls = vi.mocked(localStorage.setItem).mock.calls;
  expect(calls[0]).toEqual(["first", "value1"]);
  expect(calls[1]).toEqual(["second", "value2"]);
});
```

### Mock Return Values

```typescript
it("should mock null return for missing keys", () => {
  // Mock getItem to return null
  vi.mocked(localStorage.getItem).mockReturnValueOnce(null);

  const value = localStorage.getItem("nonexistent");
  expect(value).toBeNull();
});
```

### Test Real-World Patterns

```typescript
it("should test token storage pattern", () => {
  // Function to test
  const storeAuthTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  };

  // Test it
  storeAuthTokens("token123", "refresh456");

  // Verify with spies
  expect(localStorage.setItem).toHaveBeenCalledWith("access_token", "token123");
  expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token", "refresh456");
  expect(localStorage.setItem).toHaveBeenCalledTimes(2);
});
```

### Test Error Scenarios

```typescript
it("should handle storage quota errors", () => {
  // Mock setItem to throw
  vi.mocked(localStorage.setItem).mockImplementationOnce(() => {
    throw new Error("QuotaExceededError");
  });

  // Test error handling
  expect(() => {
    localStorage.setItem("huge_data", "x".repeat(10000000));
  }).toThrow("QuotaExceededError");
});
```

### Verify Cleanup

```typescript
it("should properly clear all data", () => {
  localStorage.setItem("key1", "value1");
  localStorage.setItem("key2", "value2");

  localStorage.clear();

  expect(localStorage.clear).toHaveBeenCalledTimes(1);
  expect(localStorage.length).toBe(0);
});
```

## Best Practices

### 1. Always Clear Between Tests

Our setup automatically clears storage and resets spies in `beforeEach`:

```typescript
beforeEach(() => {
  // Automatically done in vitest.setup.ts
  // - localStorage.clear()
  // - sessionStorage.clear()
  // - All spy call histories reset
});
```

### 2. Test Both Persistence and Retrieval

```typescript
it("should save and load user data", () => {
  // Save
  const user = { id: "123", name: "John" };
  localStorage.setItem("user", JSON.stringify(user));
  expect(localStorage.setItem).toHaveBeenCalled();

  // Load
  const stored = localStorage.getItem("user");
  expect(localStorage.getItem).toHaveBeenCalledWith("user");
  expect(JSON.parse(stored!)).toEqual(user);
});
```

### 3. Verify Exact Parameters

```typescript
it("should store with correct key and value", () => {
  const userData = { id: "456", email: "test@example.com" };
  localStorage.setItem("user_data", JSON.stringify(userData));

  // Verify exact parameters
  expect(localStorage.setItem).toHaveBeenCalledWith("user_data", JSON.stringify(userData));
});
```

### 4. Test sessionStorage Separately

```typescript
it("should use sessionStorage for temporary data", () => {
  sessionStorage.setItem("temp_state", "abc123");
  localStorage.setItem("persistent_state", "xyz789");

  // Verify they're tracked independently
  expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
  expect(localStorage.setItem).toHaveBeenCalledTimes(1);
});
```

## Common Patterns in Our Codebase

### User Data Persistence (userStore.ts)

```typescript
it("should persist user to localStorage on set", () => {
  const user = { id: "123", username: "test" };
  userStore.set(user);

  expect(localStorage.setItem).toHaveBeenCalledWith("__rixl_auth_user", JSON.stringify(user));
});
```

### Token Management (authStore.ts)

```typescript
it("should store auth tokens", () => {
  setTokens("access123", "refresh456", 3600);

  expect(localStorage.setItem).toHaveBeenCalledWith("access_token", "access123");
  expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token", "refresh456");
});
```

### OAuth State (OAuth flows)

```typescript
it("should store OAuth state temporarily", () => {
  const state = { provider: "google", nonce: "abc123" };
  sessionStorage.setItem("oauth_state", JSON.stringify(state));

  expect(sessionStorage.setItem).toHaveBeenCalledWith("oauth_state", JSON.stringify(state));
});
```

## Migration from Old Pattern

### Before (Manual Mock)

```typescript
const mockStorage = {
  store: {},
  getItem: (key) => mockStorage.store[key] || null,
  setItem: (key, value) => {
    mockStorage.store[key] = value;
  },
};
```

### After (Vitest Spy)

```typescript
// Just use localStorage directly - it's already spy-able!
localStorage.setItem("key", "value");
expect(localStorage.setItem).toHaveBeenCalledWith("key", "value");
```

## References

- [Vitest Mocking Guide](https://vitest.dev/guide/mocking.html)
- [Vitest Spy Documentation](https://vitest.dev/api/vi.html#vi-spyon)
- Our `vitest.setup.ts` for implementation details
- Our `userStore.test.ts` for real examples

## Tips

1. Use `vi.mocked()` for TypeScript type safety
2. Reset mocks in `beforeEach` (done automatically)
3. Test both happy path and error scenarios
4. Verify exact parameters, not just call count
5. Keep tests focused on one behavior at a time
