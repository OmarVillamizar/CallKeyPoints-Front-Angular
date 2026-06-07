import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Tone } from '../../core/models/tone';

/** Small tone pill (severidad, estado, sentimiento…). Color comes from the `tone` token set. */
@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [attr.data-tone]="tone()"><ng-content /></span>`,
  styleUrl: './badge.scss',
})
export class Badge {
  readonly tone = input<Tone>('neutral');
}
