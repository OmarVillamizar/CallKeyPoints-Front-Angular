import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { TechnicianProfileResponse } from '../models/config.model';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/profile`;

  get() {
    return this.http.get<TechnicianProfileResponse>(this.base);
  }

  save(displayName: string) {
    return this.http.put<TechnicianProfileResponse>(this.base, { displayName });
  }
}
