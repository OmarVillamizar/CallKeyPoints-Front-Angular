import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowLeft,
  phosphorFilePdf,
  phosphorTrash,
  phosphorWarning,
} from '@ng-icons/phosphor-icons/regular';
import { CallsApi } from '../../core/api/calls.api';
import { CallsStore } from '../../core/stores/calls.store';
import { errorMessage } from '../../core/http/http-error';
import type { CallDetail } from '../../core/models/call.model';
import { Report } from '../../ui/report/report';

/**
 * Call report page. Fetches a CallDetail by route id (declarative httpResource) and renders the
 * shared executive report, with PDF export (browser print) and an inline two-step delete. The
 * `id` binds from the route via withComponentInputBinding.
 */
@Component({
  selector: 'app-call-report',
  imports: [NgIcon, Report],
  viewProviders: [
    provideIcons({ phosphorArrowLeft, phosphorFilePdf, phosphorTrash, phosphorWarning }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './call-report.html',
  styleUrl: './call-report.scss',
})
export class CallReport {
  private readonly api = inject(CallsApi);
  private readonly calls = inject(CallsStore);
  private readonly router = inject(Router);

  readonly id = input<string>();

  private readonly detail = httpResource<CallDetail>(() => {
    const id = this.id();
    return id ? `${this.api.base}/${id}` : undefined;
  });

  protected readonly data = this.detail.value;
  protected readonly loading = this.detail.isLoading;
  protected readonly notFound = computed(() => {
    const e = this.detail.error();
    return e instanceof HttpErrorResponse && e.status === 404;
  });
  protected readonly errorMsg = computed(() => {
    const e = this.detail.error();
    if (!e || (e instanceof HttpErrorResponse && e.status === 404)) return null;
    return errorMessage(e, 'No se pudo cargar el reporte');
  });

  protected readonly confirming = signal(false);
  protected readonly deleting = signal(false);

  protected reload(): void {
    this.detail.reload();
  }

  protected exportPdf(): void {
    window.print();
  }

  protected askDelete(): void {
    this.confirming.set(true);
  }
  protected cancelDelete(): void {
    this.confirming.set(false);
  }

  protected async confirmDelete(): Promise<void> {
    const id = this.id();
    if (!id || this.deleting()) return;
    this.deleting.set(true);
    try {
      await this.calls.remove(Number(id));
      void this.router.navigateByUrl('/new');
    } catch {
      this.deleting.set(false);
      this.confirming.set(false);
    }
  }

  protected back(): void {
    void this.router.navigateByUrl('/new');
  }
}
