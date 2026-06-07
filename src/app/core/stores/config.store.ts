import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { KnowledgeBaseApi } from '../api/knowledge-base.api';
import { PromptApi } from '../api/prompt.api';
import { ProfileApi } from '../api/profile.api';
import type {
  KnowledgeBaseResponse,
  PromptTemplateResponse,
  TechnicianProfileResponse,
} from '../models/config.model';

/**
 * Knowledge base + prompt template + technician profile. Loaded on demand (config view),
 * kept as signals. The KB + prompt are the source of truth the backend uses for extraction.
 */
@Injectable({ providedIn: 'root' })
export class ConfigStore {
  private readonly kbApi = inject(KnowledgeBaseApi);
  private readonly promptApi = inject(PromptApi);
  private readonly profileApi = inject(ProfileApi);

  readonly knowledgeBase = signal<KnowledgeBaseResponse | null>(null);
  readonly prompt = signal<PromptTemplateResponse | null>(null);
  readonly profile = signal<TechnicianProfileResponse | null>(null);

  async loadAll(): Promise<void> {
    const [kb, prompt, profile] = await Promise.all([
      firstValueFrom(this.kbApi.get()),
      firstValueFrom(this.promptApi.get()),
      firstValueFrom(this.profileApi.get()),
    ]);
    this.knowledgeBase.set(kb);
    this.prompt.set(prompt);
    this.profile.set(profile);
  }

  async saveKnowledgeBase(content: string): Promise<void> {
    this.knowledgeBase.set(await firstValueFrom(this.kbApi.save(content)));
  }

  async savePrompt(content: string): Promise<void> {
    this.prompt.set(await firstValueFrom(this.promptApi.save(content)));
  }

  async saveProfile(displayName: string): Promise<void> {
    this.profile.set(await firstValueFrom(this.profileApi.save(displayName)));
  }
}
