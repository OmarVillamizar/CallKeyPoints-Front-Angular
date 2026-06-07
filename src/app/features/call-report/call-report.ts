import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorFileText } from '@ng-icons/phosphor-icons/regular';

/** Placeholder for the executive call report (built in Phase 4). `id` binds from the route. */
@Component({
  selector: 'app-call-report',
  imports: [NgIcon],
  viewProviders: [provideIcons({ phosphorFileText })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './call-report.html',
})
export class CallReport {
  readonly id = input<string>();
}
