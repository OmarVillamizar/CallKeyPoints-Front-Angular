import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorBookOpenText,
  phosphorTerminalWindow,
  phosphorUser,
  phosphorWarning,
} from '@ng-icons/phosphor-icons/regular';
import { ConfigStore } from '../../core/stores/config.store';
import { errorMessage } from '../../core/http/http-error';
import { formatLong } from '../../core/util/format';
import { ToastService } from '../../ui/toast/toast.service';

type Status = 'loading' | 'ready' | 'error';

/**
 * Knowledge base + prompt template + technician profile editor. Loads all three (GET), tracks
 * per-section dirty state against the loaded baseline, saves each independently (PUT) with a
 * toast, and lets the user revert unsaved edits.
 */
@Component({
  selector: 'app-config',
  imports: [ReactiveFormsModule, NgIcon],
  viewProviders: [
    provideIcons({
      phosphorBookOpenText,
      phosphorTerminalWindow,
      phosphorUser,
      phosphorWarning,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './config.html',
  styleUrl: './config.scss',
})
export class Config {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(ConfigStore);
  private readonly toast = inject(ToastService);

  protected readonly NAME_MAX = 120;

  protected readonly status = signal<Status>('loading');
  protected readonly errorMsg = signal('');

  protected readonly savingKb = signal(false);
  protected readonly savingPrompt = signal(false);
  protected readonly savingProfile = signal(false);

  protected readonly form = this.fb.group({
    knowledgeBase: this.fb.control(''),
    prompt: this.fb.control(''),
    displayName: this.fb.control('', [Validators.maxLength(this.NAME_MAX)]),
  });

  // live values (for dirty + char counts)
  private readonly kbValue = toSignal(this.form.controls.knowledgeBase.valueChanges, {
    initialValue: '',
  });
  private readonly promptValue = toSignal(this.form.controls.prompt.valueChanges, {
    initialValue: '',
  });
  private readonly nameValue = toSignal(this.form.controls.displayName.valueChanges, {
    initialValue: '',
  });

  // baselines (last loaded/saved server state)
  protected readonly kbBaseline = computed(() => this.store.knowledgeBase()?.content ?? '');
  protected readonly promptBaseline = computed(() => this.store.prompt()?.content ?? '');
  protected readonly nameBaseline = computed(() => this.store.profile()?.displayName ?? '');

  protected readonly kbDirty = computed(() => this.kbValue() !== this.kbBaseline());
  protected readonly promptDirty = computed(() => this.promptValue() !== this.promptBaseline());
  protected readonly nameDirty = computed(() => this.nameValue() !== this.nameBaseline());

  protected readonly kbCount = computed(() => this.kbValue().length);
  protected readonly promptCount = computed(() => this.promptValue().length);
  protected readonly nameInvalid = computed(() => this.nameValue().length > this.NAME_MAX);

  protected readonly kbUpdated = computed(() => formatLong(this.store.knowledgeBase()?.updatedAt ?? undefined));
  protected readonly promptUpdated = computed(() => formatLong(this.store.prompt()?.updatedAt ?? undefined));
  protected readonly profileUpdated = computed(() => formatLong(this.store.profile()?.updatedAt ?? undefined));

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    this.errorMsg.set('');
    try {
      await this.store.loadAll();
      this.form.setValue({
        knowledgeBase: this.kbBaseline(),
        prompt: this.promptBaseline(),
        displayName: this.nameBaseline(),
      });
      this.status.set('ready');
    } catch (err) {
      this.errorMsg.set(errorMessage(err, 'No se pudo cargar la configuración'));
      this.status.set('error');
    }
  }

  protected async saveKb(): Promise<void> {
    if (!this.kbDirty() || this.savingKb()) return;
    this.savingKb.set(true);
    try {
      await this.store.saveKnowledgeBase(this.form.controls.knowledgeBase.value);
      this.toast.success('Base de conocimiento guardada');
    } catch (err) {
      this.toast.error(errorMessage(err, 'No se pudo guardar la base de conocimiento'));
    } finally {
      this.savingKb.set(false);
    }
  }

  protected async savePrompt(): Promise<void> {
    if (!this.promptDirty() || this.savingPrompt()) return;
    this.savingPrompt.set(true);
    try {
      await this.store.savePrompt(this.form.controls.prompt.value);
      this.toast.success('Plantilla de prompt guardada');
    } catch (err) {
      this.toast.error(errorMessage(err, 'No se pudo guardar el prompt'));
    } finally {
      this.savingPrompt.set(false);
    }
  }

  protected async saveProfile(): Promise<void> {
    if (!this.nameDirty() || this.nameInvalid() || this.savingProfile()) return;
    this.savingProfile.set(true);
    try {
      await this.store.saveProfile(this.form.controls.displayName.value.trim());
      this.toast.success('Perfil actualizado');
    } catch (err) {
      this.toast.error(errorMessage(err, 'No se pudo guardar el perfil'));
    } finally {
      this.savingProfile.set(false);
    }
  }

  protected resetKb(): void {
    this.form.controls.knowledgeBase.setValue(this.kbBaseline());
  }
  protected resetPrompt(): void {
    this.form.controls.prompt.setValue(this.promptBaseline());
  }
  protected resetProfile(): void {
    this.form.controls.displayName.setValue(this.nameBaseline());
  }
}
