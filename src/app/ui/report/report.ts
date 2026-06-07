import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCheckCircle } from '@ng-icons/phosphor-icons/regular';
import type { CallDetail } from '../../core/models/call.model';
import {
  cumplimientoTone,
  estadoTone,
  formatLong,
  responsabilidadTone,
  sentimientoTone,
  severidadTone,
} from '../../core/util/format';
import { Badge } from '../badge/badge';

/**
 * Executive call report — the printable 9-section document. Pure presentational: pass a
 * `CallDetail` and it renders every section that has data, recolored to the warm monochrome
 * palette. Shared by the new-report live result and the call-report page (PDF export).
 */
@Component({
  selector: 'app-report',
  imports: [NgIcon, Badge],
  viewProviders: [provideIcons({ phosphorCheckCircle })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.html',
  styleUrl: './report.scss',
})
export class Report {
  readonly data = input.required<CallDetail>();

  protected readonly atendio = computed(
    () => this.data().atendio || this.data().technicianName || '',
  );
  protected readonly fecha = computed(() =>
    formatLong(this.data().reportGeneratedAt || this.data().createdAt),
  );
  protected readonly acciones = computed(() => this.data().accionesRecomendadas ?? []);

  protected readonly cumplimiento = computed(() => {
    const v = this.data().cumplimientoProtocolo;
    return v ? cumplimientoTone(v) : 'neutral';
  });
  protected readonly cumplimientoLabel = computed(() => {
    const t = this.cumplimiento();
    return t === 'ok' ? 'Cumple' : t === 'alert' ? 'No cumple' : 'Parcial';
  });

  protected readonly otNumber = computed(() =>
    (this.data().ordenTrabajo ?? '').replace(/^OT[-\s]*/i, ''),
  );

  // tone helpers exposed for the template
  protected readonly severidadTone = severidadTone;
  protected readonly responsabilidadTone = responsabilidadTone;
  protected readonly estadoTone = estadoTone;
  protected readonly sentimientoTone = sentimientoTone;
}
