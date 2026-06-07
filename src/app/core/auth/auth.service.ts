import { Injectable, computed, inject, signal } from '@angular/core';
import type { AuthError, Session } from '@supabase/supabase-js';
import { SUPABASE } from './supabase.client';

/**
 * Auth state as signals. The Supabase session is the source of truth; `onAuthStateChange`
 * keeps the `session` signal in sync (login, logout, token refresh, tab focus).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SUPABASE);

  private readonly _session = signal<Session | null>(null);
  readonly session = this._session.asReadonly();
  readonly user = computed(() => this._session()?.user ?? null);
  readonly email = computed(() => this._session()?.user?.email ?? null);
  readonly isAuthenticated = computed(() => this._session() !== null);

  constructor() {
    this.supabase.auth.onAuthStateChange((_event, session) => this._session.set(session));
  }

  /** Restore a persisted session before the app renders (called from provideAppInitializer). */
  async restore(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();
    this._session.set(data.session);
  }

  async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  /** Fresh access token for the Authorization header (Supabase refreshes it as needed). */
  async accessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }
}
