/**
 * Development environment. Used by `ng serve` / development build.
 * Fill supabaseUrl + supabaseAnonKey with the SAME Supabase project the React app uses.
 * The anon key is browser-safe (public). Keep all other secrets server-side only.
 */
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:9080',
  supabaseUrl: 'https://uxyswambwshpgmqjhgtj.supabase.co',
  supabaseAnonKey: 'sb_publishable_bgRnOTJlTIleOiJT0CJmcQ_Io_DTpMz',
};
