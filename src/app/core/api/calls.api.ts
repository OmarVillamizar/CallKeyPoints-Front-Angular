import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { CallDetail } from '../models/call.model';

/**
 * Call mutations (POST/DELETE). Reads (GET list/detail) are declarative via httpResource in
 * the store / report component — see CallsStore. `base` is exposed for those resources.
 */
@Injectable({ providedIn: 'root' })
export class CallsApi {
  private readonly http = inject(HttpClient);
  readonly base = `${environment.apiBaseUrl}/api/calls`;

  /** Slow: backend runs the LLM extraction synchronously. Show a loading state. */
  create(transcript: string) {
    return this.http.post<CallDetail>(this.base, { transcript });
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
