# CallKeyPoints — Angular Frontend (agent notes)

Demo/portfolio Angular frontend for CallKeyPoints. Consumes `CallKeyPoints-Microservice`
(Spring Boot, `http://localhost:9080`). React reference impl: `CallKeyPoints-Front-React`.

## Angular-native conventions (enforced — no legacy patterns)

- **Standalone components only**, `ChangeDetectionStrategy.OnPush`, **zoneless**
  (`provideZonelessChangeDetection`). No NgModules. No zone.js.
- **v20+ file naming**: `sidebar.ts` / class `Sidebar` (no `.component` suffix), self-closing tags.
- **Signals as state primitive**: `signal`, `computed`, `linkedSignal`; signal-based
  `input()` / `output()` / `model()` for component IO. No `@Input`/`@Output` decorators.
- **Declarative reads** via `httpResource` / `resource()` for GET (calls list/detail, KB, prompt,
  profile). `HttpClient` only for POST/PUT/DELETE mutations.
- **Signal stores**: plain injectable services exposing readonly signals + `computed` + mutators.
  No NgRx. Cross-component access via `inject()`.
- **`inject()`** over constructor DI. `DestroyRef` + `takeUntilDestroyed` for teardown.
  `provideAppInitializer` restores the Supabase session before first render.
- **Functional** `HttpInterceptorFn` (auth, error) and `CanActivateFn` guards.
- **New control flow** `@if / @for (track) / @switch`, `@let`, and `@defer` (`on viewport` / `on idle`)
  for heavy report sections + sessions list.
- **Native template animations** `animate.enter` / `animate.leave` (not `@angular/animations`)
  + `provideRouter(withViewTransitions())`. Motion One (`motion`) only for sidebar spring + physics.
- **Typed reactive forms** (`NonNullableFormBuilder`) for login, composer, config editors.
- **Styling**: component-scoped SCSS reading global CSS custom-property tokens in `src/styles.scss`.
  Warm monochrome, light-locked: cream/beige + espresso ink accent. One radius scale, fine strokes.
- **Responsive**: CSS container queries + tokens; `min-h: 100dvh`, never `h-screen`. Honor
  `prefers-reduced-motion` for all motion.
- **Tactile controls (required)**: every button / interactive control dips on `:active`
  (`transform: scale(0.97)`) for physical feedback. Real `<button>`s inherit it from the global
  rule in `styles.scss`; `<a>` link-buttons add a matching `:active` transform and must include
  `transform` in their own `transition`. Reduced-motion users get an instant snap.

## Structure

```
src/environments/      apiBaseUrl, supabaseUrl, supabaseAnonKey (dev swap via fileReplacements)
src/styles.scss        global tokens + base + print + reduced-motion
src/app/
  app.config.ts        zoneless CD, HttpClient(+interceptors P1), router(lazy, view transitions)
  app.routes.ts        lazy routes + authGuard
  core/{auth,http,api,models,stores,util}
  ui/                  shared presentational (button, badge, tile, field, skeleton, icon, toast)
  layout/{app-shell,sidebar}
  features/{auth/login,new-report,call-report,config}
```

## Backend contract

Base `http://localhost:9080`, all `/api/**` need Bearer JWT (sub = UUID). Set backend
`CORS_ALLOWED_ORIGINS=http://localhost:4200`. Endpoints: `POST/GET /api/calls`,
`GET/DELETE /api/calls/{id}`, `GET/PUT /api/knowledge-base`, `GET/PUT /api/prompt`,
`GET/PUT /api/profile`. `POST /api/calls` is slow (sync LLM) and rate-limited — show loading.
`CallDetail` carries report fields as explicit columns (no client-side JSON parse).

## Build phases (commit + push after each, on user authorization)

0 Foundation/tooling · 1 Core domain (models/api/auth/stores) · 2 App shell + animated sidebar ·
3 New report flow · 4 Call report + PDF · 5 Config (KB/prompt/profile) · 6 Polish.
