// AuthenticationProvider implementations that skip Kiota's HTTPS-only
// check, so the examples can run against a local plaintext server.

export class ApiKeyHeaderAuth {
    constructor(key) {
        this.key = key;
    }

    async authenticateRequest(request) {
        request.headers.add("X-API-Key", this.key);
    }
}

export class BearerAuth {
    constructor(token) {
        this.token = token;
    }

    async authenticateRequest(request) {
        request.headers.add("Authorization", `Bearer ${this.token}`);
    }
}
