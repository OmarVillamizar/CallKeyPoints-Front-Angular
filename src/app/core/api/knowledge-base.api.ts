import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { KnowledgeBaseResponse } from '../models/config.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/knowledge-base`;

  get() {
    return this.http.get<KnowledgeBaseResponse>(this.base);
  }

  save(content: string) {
    return this.http.put<KnowledgeBaseResponse>(this.base, { content });
  }
}
