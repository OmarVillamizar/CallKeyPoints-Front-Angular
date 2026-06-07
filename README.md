# CallKeyPoints — Angular Frontend

Single-page app for **CallKeyPoints**: paste a call transcript, get back an AI-generated
**structured attention report** (client data, classification, diagnosis, recommended actions,
quality, executive summary). Authenticate with Supabase, then manage your own list of
processed calls ("sessions") from an animated sidebar.

This is the **frontend only**. It consumes the separate Spring Boot backend
`CallKeyPoints-Microservice` over REST. Built as a **technical demo / portfolio** showcasing
modern, idiomatic Angular.

---

## Tech stack

| Concern | Choice |
|---------|--------|
| Framework | Angular **v22**, standalone, **zoneless** change detection |
| State | **Signals** + signal stores (no NgRx) |
| Async reads | `httpResource` / `resource()` (declarative); `HttpClient` for mutations |
| Routing | Lazy `loadComponent`, functional guards, `withViewTransitions`, `withComponentInputBinding` |
| Auth | **Supabase Auth** (`@supabase/supabase-js`) → JWT → `Authorization: Bearer` |
| Styling | **SCSS + CSS custom-property tokens** (warm monochrome, light-locked). No Tailwind. |
| Animation | Native Angular `animate.enter/leave` + CSS + **Motion One** (`motion`) for sidebar physics |
| Icons | `@ng-icons/core` + Phosphor |
| PDF export | Browser print + `@media print` CSS |

---

## Run locally

```bash
npm install
npm start          # ng serve → http://localhost:4200
```

Other scripts:

```bash
npm run build      # ng build → dist/
npm test           # vitest
```

### Talking to the backend

- Backend runs on **http://localhost:9080** (`./mvnw spring-boot:run` in `CallKeyPoints-Microservice`).
- Backend Swagger: **http://localhost:9080/swagger-ui/index.html**.
- Backend CORS must allow this app's origin: set `CORS_ALLOWED_ORIGINS=http://localhost:4200`.

---

## Environment

Values live in `src/environments/`. The production `environment.ts` is swapped for
`environment.development.ts` during `ng serve` (see `fileReplacements` in `angular.json`).

| Var | Description |
|-----|-------------|
| `apiBaseUrl` | Backend base, e.g. `http://localhost:9080` |
| `supabaseUrl` | Supabase project URL (`https://<ref>.supabase.co`) — same project as the React app |
| `supabaseAnonKey` | Supabase anon/public key (browser-safe) |

**Never** put the Supabase service-role key, JWT secret, DB password, or LLM key in this
frontend. Only the public anon key belongs here.

---

## Auth flow

1. User logs in through Supabase Auth → receives a session JWT.
2. Every `/api/**` call sends `Authorization: Bearer <token>` (auth interceptor).
3. Backend validates the JWT (JWKS) and scopes all data by the user's `sub` (UUID).
4. Missing/invalid token on a protected route → **401** → redirect to login.
5. Tokens expire — refreshed via the Supabase session, never hardcoded.

---

## Backend API (all require auth)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/calls` | Create call: runs AI extraction, persists (slow, rate-limited) |
| `GET` | `/api/calls` | List current user's calls (summary), newest first |
| `GET` | `/api/calls/{id}` | One full call (`CallDetail`) |
| `DELETE` | `/api/calls/{id}` | Delete one call |
| `GET`/`PUT` | `/api/knowledge-base` | Read / save the KB (`{ content }`) |
| `GET`/`PUT` | `/api/prompt` | Read / save the prompt template (`{ content }`) |
| `GET`/`PUT` | `/api/profile` | Read / save technician `{ displayName }` |

`CallDetail` exposes the structured report fields as explicit columns (no client-side JSON parse).

---

## Conventions

See `CLAUDE.md` for the full Angular-native conventions enforced in this project
(standalone, signals, `httpResource`, functional interceptors/guards, `@if/@for/@defer`,
native template animations, typed reactive forms, component-scoped SCSS over CSS tokens).
