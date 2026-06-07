import { Injectable, computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CallsApi } from '../api/calls.api';
import { AuthService } from '../auth/auth.service';
import type { CallSummary } from '../models/call.model';
import { errorMessage } from '../http/http-error';

/**
 * Session/call list state. The list is a declarative httpResource that re-fetches whenever
 * auth flips to authenticated, and can be reloaded after a create/delete. Exposed as signals.
 */
@Injectable({ providedIn: 'root' })
export class CallsStore {
  private readonly api = inject(CallsApi);
  private readonly auth = inject(AuthService);

  private readonly listRes = httpResource<CallSummary[]>(
    () => (this.auth.isAuthenticated() ? this.api.base : undefined),
    { defaultValue: [] },
  );

  readonly calls = this.listRes.value;
  readonly loading = this.listRes.isLoading;
  readonly error = computed(() => {
    const e = this.listRes.error();
    return e ? errorMessage(e, 'No se pudieron cargar los casos') : null;
  });
  readonly count = computed(() => this.calls().length);

  /** Re-fetch the list (after creating or deleting a call). */
  reload(): void {
    this.listRes.reload();
  }

  async remove(id: number): Promise<void> {
    await firstValueFrom(this.api.remove(id));
    this.reload();
  }
}
