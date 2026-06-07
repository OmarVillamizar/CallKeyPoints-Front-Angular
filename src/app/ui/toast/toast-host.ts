import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCheckCircle, phosphorWarningCircle, phosphorX } from '@ng-icons/phosphor-icons/regular';
import { ToastService } from './toast.service';

/** Renders the toast stack (bottom-right). Mounted once in the app shell. */
@Component({
  selector: 'app-toast-host',
  imports: [NgIcon],
  viewProviders: [provideIcons({ phosphorCheckCircle, phosphorWarningCircle, phosphorX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-host.html',
  styleUrl: './toast-host.scss',
})
export class ToastHost {
  private readonly svc = inject(ToastService);
  protected readonly toasts = this.svc.toasts;

  protected dismiss(id: number): void {
    this.svc.dismiss(id);
  }
}
