import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorGearSix } from '@ng-icons/phosphor-icons/regular';

/** Placeholder for the KB + prompt + profile editor (built in Phase 5). */
@Component({
  selector: 'app-config',
  imports: [NgIcon],
  viewProviders: [provideIcons({ phosphorGearSix })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './config.html',
})
export class Config {}
