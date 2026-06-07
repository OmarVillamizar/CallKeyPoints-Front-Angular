import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowRight,
  phosphorPaperPlaneTilt,
  phosphorSparkle,
  phosphorWarning,
} from '@ng-icons/phosphor-icons/regular';
import { CallsApi } from '../../core/api/calls.api';
import { CallsStore } from '../../core/stores/calls.store';
import { errorMessage } from '../../core/http/http-error';
import type { CallDetail } from '../../core/models/call.model';
import { Report } from '../../ui/report/report';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * New-report composer. Paste a transcript -> POST /api/calls (slow, synchronous LLM) -> the
 * result renders live next to the form. The list store reloads so the sidebar picks it up.
 */
@Component({
  selector: 'app-new-report',
  imports: [ReactiveFormsModule, NgIcon, Report],
  viewProviders: [
    provideIcons({ phosphorArrowRight, phosphorPaperPlaneTilt, phosphorSparkle, phosphorWarning }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-report.html',
  styleUrl: './new-report.scss',
})
export class NewReport {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(CallsApi);
  private readonly calls = inject(CallsStore);
  private readonly router = inject(Router);

  protected readonly MAX = 50000;

  protected readonly form = this.fb.group({
    transcript: this.fb.control('', [Validators.required, Validators.maxLength(this.MAX)]),
  });

  private readonly transcript = toSignal(this.form.controls.transcript.valueChanges, {
    initialValue: '',
  });
  protected readonly count = computed(() => this.transcript().trim().length);

  protected readonly status = signal<Status>('idle');
  protected readonly result = signal<CallDetail | null>(null);
  protected readonly errorMsg = signal('');
  protected readonly loading = computed(() => this.status() === 'loading');

  protected async submit(): Promise<void> {
    const transcript = this.form.controls.transcript.value.trim();
    if (!transcript || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('loading');
    this.errorMsg.set('');
    try {
      const data = await firstValueFrom(this.api.create(transcript));
      this.result.set(data);
      this.status.set('success');
      this.calls.reload();
    } catch (err) {
      this.errorMsg.set(errorMessage(err, 'No se pudo procesar la llamada'));
      this.status.set('error');
    }
  }

  protected open(): void {
    const id = this.result()?.id;
    if (id != null) void this.router.navigateByUrl(`/calls/${id}`);
  }
}
