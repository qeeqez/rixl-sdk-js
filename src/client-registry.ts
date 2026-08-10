import {client} from "./generated/client.gen";
import {shared} from "./shared-runtime";

type GeneratedClient = typeof client;
type ClientInitializer = (target: GeneratedClient) => void;

/**
 * The baseUrl the code generator bakes in. It is derived from the origin of the
 * OpenAPI input URL, not from a real server, so a client still holding it has
 * simply never been configured. Captured from the client itself rather than
 * hardcoded so it stays correct if the generator input ever moves.
 */
const placeholderBaseUrl = shared("placeholderBaseUrl", () => client.getConfig().baseUrl);

const clients = shared("clients", () => new Set<GeneratedClient>());

/** Setup applied to every client copy, including ones registered later. */
const initializers = shared("clientInitializers", () => [] as ClientInitializer[]);

/** Last baseUrl passed to {@link configureAllClients}, replayed onto late joiners. */
const appliedConfig = shared("appliedConfig", () => ({baseUrl: undefined as string | undefined}));

function isUnconfigured(target: GeneratedClient): boolean {
  const {baseUrl} = target.getConfig();
  return !baseUrl || baseUrl === placeholderBaseUrl;
}

/**
 * Fails a request that would otherwise be sent to the generator's placeholder
 * host. Without this the request goes out looking legitimate and comes back a
 * 404 from an unrelated origin, which reads like a backend fault instead of
 * "the SDK was never initialised".
 */
function installUnconfiguredGuard(target: GeneratedClient): void {
  target.interceptors.request.use((request: Request) => {
    if (isUnconfigured(target)) {
      throw new Error(
        `[@rixl/sdk] Cannot send ${request.method} ${new URL(request.url).pathname}: no baseUrl is configured. ` +
          "Call connect({baseUrl}) before issuing requests."
      );
    }
    return request;
  });
}

/**
 * Registers setup to run against every client copy — those already known and
 * any that register afterwards. Interceptors added through here therefore reach
 * a copy that loads from a lazy chunk after `connect()` has already run.
 */
export function addClientInitializer(initialize: ClientInitializer): void {
  initializers.push(initialize);
  for (const target of clients) {
    initialize(target);
  }
}

/**
 * Adds a client to the shared registry so configuration reaches it. Registering
 * is idempotent, and a client that joins late is brought fully up to date.
 */
export function registerClient(target: GeneratedClient): void {
  if (clients.has(target)) return;
  clients.add(target);

  installUnconfiguredGuard(target);
  for (const initialize of initializers) {
    initialize(target);
  }

  if (appliedConfig.baseUrl !== undefined) {
    target.setConfig({baseUrl: appliedConfig.baseUrl});
  }
}

/**
 * Points every known client copy at `baseUrl`.
 *
 * Duplicate copies of this package each construct their own client object, and
 * the generated request functions close over whichever one their copy owns.
 * Configuring only the caller's copy is what leaves a bundled library issuing
 * requests to the placeholder host.
 */
export function configureAllClients(baseUrl: string): void {
  appliedConfig.baseUrl = baseUrl;
  for (const target of clients) {
    target.setConfig({baseUrl});
  }
}

registerClient(client);
