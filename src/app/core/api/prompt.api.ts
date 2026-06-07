import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { PromptTemplateResponse } from '../models/config.model';

@Injectable({ providedIn: 'root' })
export class PromptApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/prompt`;

  get() {
    return this.http.get<PromptTemplateResponse>(this.base);
  }

  save(content: string) {
    return this.http.put<PromptTemplateResponse>(this.base, { content });
  }
}
