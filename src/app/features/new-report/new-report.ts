import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorNotePencil } from '@ng-icons/phosphor-icons/regular';

/** Placeholder for the new-report composer (built in Phase 3). */
@Component({
  selector: 'app-new-report',
  imports: [NgIcon],
  viewProviders: [provideIcons({ phosphorNotePencil })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-report.html',
})
export class NewReport {}
