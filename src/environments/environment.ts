/**
 * Production environment (default). Dev build swaps this for environment.development.ts
 * via the fileReplacements entry in angular.json.
 *
 * NOTE: supabaseAnonKey is the public anon key — safe to ship to the browser.
 * Never put the Supabase service-role key, JWT secret, DB password or LLM key here.
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
};
