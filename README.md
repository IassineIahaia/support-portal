# Support Portal

Customer Service Request Portal — a responsive single-page application for managing customer service requests, built as a technical challenge submission.

## 1. Solution Overview

Support Portal is a React + TypeScript SPA that allows authenticated support agents to view, search, filter, sort, create, and update customer service requests. It consumes a REST API described by an OpenAPI 3 specification and authenticates users via an external OpenID Connect provider (Auth0).

Key highlights:

- **Type-safe API contract**: TypeScript types are generated directly from the OpenAPI spec (`openapi-typescript`), eliminating drift between the API contract and the frontend.
- **Optimistic concurrency control**: status updates use a `version` field and gracefully handle `409 Conflict` responses when two agents edit the same request concurrently.
- **Progressive Web App**: installable, with an offline-friendly caching strategy for API responses and static assets.
- **Full test coverage of critical flows**: including an automated test that reproduces the exact concurrency conflict scenario (409) using MSW.

## 2. Technology and Library Choices

| Concern            | Choice                                             | Why                                                                                                                                                        |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build tool         | Vite                                               | Fast dev server, native ESM, first-class React + TS support                                                                                                |
| Language           | TypeScript (strict mode)                           | Type safety across the whole app, especially the API contract                                                                                              |
| Routing            | React Router v7                                    | Standard, well-documented client-side routing solution                                                                                                     |
| Server state       | TanStack Query                                     | Caching, request deduplication, background refetching, optimistic updates — all the things a hand-rolled `useEffect` fetch layer would need to reimplement |
| Forms & validation | React Hook Form + Zod                              | Zod schemas mirror the OpenAPI field constraints (min/max lengths) exactly; RHF keeps re-renders minimal                                                   |
| Styling            | Tailwind CSS v4                                    | Utility-first, fast to iterate, design tokens map directly to a CSS `@theme` block                                                                         |
| Auth               | `react-oidc-context` + `oidc-client-ts` with Auth0 | Standards-compliant OIDC client using Authorization Code + PKCE, the recommended flow for SPAs                                                             |
| API mocking        | MSW (Mock Service Worker)                          | Intercepts requests at the network level — the app talks to `/api/*` exactly as it would against a real backend, in both development and tests             |
| Type generation    | `openapi-typescript`                               | Generates TypeScript types directly from `openapi.yaml`, so the contract is the single source of truth                                                     |
| Testing            | Vitest + React Testing Library                     | Fast, Vite-native test runner; RTL encourages testing behavior over implementation details                                                                 |
| CI/CD              | GitHub Actions                                     | Lint, type-check, test, and build run automatically on every push/PR                                                                                       |
| PWA                | `vite-plugin-pwa` (Workbox)                        | Generates the manifest and service worker with minimal configuration                                                                                       |

## 3. Architecture Summary

The codebase is organized by **feature**, not by file type:

```
src/
  app/              # Global providers (QueryClient, AuthProvider), router
  features/
    auth/           # OIDC config, RequireAuth guard, callback page
    requests/       # Everything related to service requests
      components/   # StatusTrail, StatusChangeControl
      hooks/        # useServiceRequests, useServiceRequest, mutations
      lib/          # Zod schema, status/priority-to-badge mappers
      pages/        # RequestListPage, RequestDetailPage, CreateRequestPage
  shared/
    ui/             # Reusable design-system components (Button, Badge, TextField...)
    lib/            # API client, debounce hook
    types/          # Generated OpenAPI types (source of truth)
  mocks/            # MSW handlers, in-memory mock data, browser/server setup
```

**Data flow**: components call feature-specific hooks (e.g. `useServiceRequests`) → hooks call a small typed `apiClient` wrapper around `fetch` → in development and tests, MSW intercepts these calls and returns data from an in-memory store that mimics the real API's behavior, including validation and conflict errors.

**State management** is split intentionally: TanStack Query owns _server_ state (requests, pagination, caching), while local `useState`/URL search params own _UI_ state (form inputs, filters). Filters, search, sort, and pagination all live in the URL (`useSearchParams`), so the current view is shareable and survives a page reload.

## 4. Local Setup Instructions

**Prerequisites**: Node.js 20+ and npm.

```bash
git clone https://github.com/IassineIahaia/support-portal.git
cd support-portal
npm install --legacy-peer-deps
cp .env.example .env.local   # then fill in the values, see section 5
npm run generate:types       # generates src/shared/types/api.ts from openapi.yaml
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note on `--legacy-peer-deps`**: this project uses TypeScript 6, which is newer than the peer dependency range declared by `openapi-typescript` (`^5.x`). The packages are fully compatible in practice; this flag only bypasses npm's overly strict peer-dependency check.

## 5. OIDC Provider Configuration

This project uses [Auth0](https://auth0.com) as the OpenID Connect provider, authenticating via the **Authorization Code flow with PKCE** — the recommended flow for single-page applications, since a SPA cannot safely store a client secret.

To run this project with your own Auth0 tenant:

1. Create a free Auth0 account and tenant.
2. Create a new Application of type **Single Page Application**.
3. In the application's **Settings**, configure:
   - **Allowed Callback URLs**: `http://localhost:5173/callback`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Copy the **Domain** and **Client ID** shown in Settings into your `.env.local` file (see section 6).

The Auth0 Client ID is safe to expose publicly — unlike a client secret, it is not a credential and is designed to be visible in frontend code.

Auth0 uses a proprietary logout endpoint (`/v2/logout`) rather than the standard OIDC `end_session_endpoint`; this is handled in `src/features/auth/lib/oidc-config.ts` (`auth0LogoutUrl`).

## 6. Environment Variable Configuration

Copy `.env.example` to `.env.local` and fill in the values:

| Variable                  | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `VITE_AUTH0_DOMAIN`       | Your Auth0 tenant domain, e.g. `your-tenant.us.auth0.com`                    |
| `VITE_AUTH0_CLIENT_ID`    | The Client ID of your Auth0 SPA application                                  |
| `VITE_AUTH0_REDIRECT_URI` | Where Auth0 redirects after login — `http://localhost:5173/callback` locally |
| `VITE_AUTH0_LOGOUT_URI`   | Where Auth0 redirects after logout — `http://localhost:5173` locally         |

`.env.local` is git-ignored and never committed. No real credentials are stored in this repository.

## 7. API-Mocking Approach

No live backend was provided alongside the OpenAPI specification, so this project runs entirely against a mocked API using **MSW (Mock Service Worker)**.

- Handlers (`src/mocks/handlers.ts`) faithfully implement every endpoint, status code, and validation rule described in `openapi.yaml`: pagination, search, filtering, sorting, request creation with field validation (`422`), status transitions restricted to the state machine defined in the spec, optimistic-concurrency conflicts (`409`), and RFC 7807 `ProblemDetails` error responses.
- `src/mocks/data.ts` seeds an in-memory "database" with realistic sample requests.
- `src/mocks/browser.ts` registers the mock service worker for the browser (development mode).
- `src/mocks/server.ts` registers an equivalent mock server for the Node test environment, so automated tests exercise the same handlers as the real app.

**Known limitation**: because the mock "database" lives in the browser's Service Worker memory, it is scoped per browser instance and resets on every hot-reload or page refresh. Two tabs in _different_ browsers (e.g. Chrome vs Edge) do not share mocked data, and a full page reload resets all mutations back to the seed data. A real backend with a persistent database would not have this limitation.

## 8. Development, Lint, Test, and Build Commands

| Command                  | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `npm run dev`            | Starts the Vite dev server with MSW mocking enabled                      |
| `npm run build`          | Type-checks, builds for production, and generates the PWA service worker |
| `npm run preview`        | Serves the production build locally                                      |
| `npm run lint`           | Runs ESLint across the project                                           |
| `npm run test`           | Runs the full test suite once (Vitest)                                   |
| `npm run test:watch`     | Runs tests in watch mode                                                 |
| `npm run generate:types` | Regenerates `src/shared/types/api.ts` from `openapi.yaml`                |

## 9. Testing Strategy

Tests are written with **Vitest** and **React Testing Library**, following the principle of testing behavior visible to the user rather than implementation details.

Coverage focuses on the flows most likely to hide bugs or regressions:

- **`Badge`**: renders correct content and status/priority color mapping.
- **`StatusTrail`**: exposes an accessible label reflecting current status; renders one node per lifecycle stage.
- **`StatusChangeControl`**: only renders the status transitions valid for the current state (per the OpenAPI-defined state machine); shows no actions when a request is `CLOSED`; **reproduces the exact optimistic-concurrency conflict scenario** by forcing MSW to return a `409`, asserting the UI surfaces a clear conflict message with a reload action.
- **`CreateRequestPage`**: client-side validation errors appear for an empty submission; a fully valid submission succeeds end-to-end against the mocked API.
- **`ApiErrorState`**: `403` responses show a permission message without triggering a re-authentication redirect; other error statuses show a generic retry state.

MSW is used in tests via `src/mocks/server.ts`, so component tests exercise the same request/response contract as the running application — no ad-hoc mocking of `fetch` per test file.

## 10. GitHub Actions Workflow

The workflow at `.github/workflows/ci.yml` runs automatically on every push and pull request to `main`:

1. **Checkout** the repository.
2. **Setup Node.js 22** with npm dependency caching.
3. **Install dependencies** (`npm ci --legacy-peer-deps`).
4. **Lint** the codebase.
5. **Type-check** with `tsc -b --noEmit`.
6. **Run the test suite**.
7. **Build** for production.

The workflow fails fast on the first failing step, giving quick feedback on regressions before merge.

## 11. Security and Accessibility Considerations

### Security

- **Authentication** uses OIDC Authorization Code flow **with PKCE**, the flow recommended for public clients (SPAs) that cannot safely store a client secret.
- **No tokens are persisted in `localStorage`** by application code; `react-oidc-context` manages token storage internally.
- **Every API request carries a Bearer token** attached via the typed `apiClient` wrapper; `401` responses trigger a re-authentication redirect, while `403` responses show a permission-denied message without attempting to re-authenticate (a `403` means the user is already correctly identified but lacks permission — re-authenticating would not help and would only confuse the user).
- **Client-side validation is not treated as a security boundary**: all Zod validation on the create-request form mirrors server-side constraints, but the mock API independently re-validates every request server-side and returns `422` with field-level errors regardless of what the client already checked.
- **No secrets are committed to the repository**; `.env.local` is git-ignored, and `.env.example` documents required variables without real values. The Auth0 Client ID is the only credential-like value present anywhere, and it is safe to expose (see section 5).

### Accessibility

- **Skip link**: a "Skip to main content" link is the first focusable element on every authenticated page, allowing keyboard users to bypass the header.
- **Semantic landmarks**: page content is wrapped in a `<main>` element.
- **Full keyboard navigation**: all interactive elements (buttons, inputs, selects, links) are natively focusable, with a visible focus ring (`focus-visible`) that only appears on keyboard navigation, not on mouse clicks.
- **`aria-live` announcements**: conflict (409) and invalid-transition (422) messages use `role="alert"` so screen readers announce them immediately as they appear.
- **Form accessibility**: invalid fields are marked with `aria-invalid`, and each error message is linked to its field via `aria-describedby`, so screen readers announce the specific validation error when the field receives focus.
- **Color is never the only signal**: status and priority are always paired with text labels (via `Badge`), not conveyed by color alone.

## 12. Known Limitations

- **Mocked backend**: this project has no live backend. All data lives in an in-memory MSW mock, seeded on load and reset on every full page reload or hot-reload. In a production system, the same frontend would talk to a real API implementing the same OpenAPI contract, with no code changes required beyond the base URL.
- **Duplicated transition rules**: the valid status-transition table (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`) is defined both in `StatusChangeControl.tsx` (to drive the UI) and in the mock handlers (to validate server-side). In a real system, this rule should live only on the server, with the client either fetching allowed transitions dynamically or simply relying on the server's `422` response — duplicating it here was a pragmatic choice given both "ends" are mocked in this project.
- **Single bundle size**: the production build currently ships as a single JavaScript chunk (~500 KB minified). Route-based code splitting (`React.lazy` per page) was not implemented due to time constraints, but would be the next optimization for a larger version of this app.
- **No end-to-end (Playwright/Cypress) tests**: automated coverage stops at the component/integration level (Vitest + Testing Library + MSW). E2E tests running against a real build were out of scope given the challenge's time constraints.
- **Auth0 free-tier session behavior**: some Auth0 free-tier account behaviors (e.g. email verification prompts) are outside this project's control and are standard Auth0 platform behavior, not application logic.

## Live Deployment

- **App**: https://support-portal-phi.vercel.app
- **Repository**: https://github.com/IassineIahaia/support-portal