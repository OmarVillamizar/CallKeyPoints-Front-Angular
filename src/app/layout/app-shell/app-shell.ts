import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorList } from '@ng-icons/phosphor-icons/regular';
import { Sidebar } from '../sidebar/sidebar';
import { ToastHost } from '../../ui/toast/toast-host';

/**
 * Authenticated app shell: desktop icon-rail sidebar + routed content, plus a mobile top-bar
 * and off-canvas drawer (same sidebar in `drawer` mode). Route fades come from the router's
 * view transitions; the drawer/scrim use native animate.enter / animate.leave.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, NgIcon, ToastHost],
  viewProviders: [provideIcons({ phosphorList })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected readonly drawerOpen = signal(false);

  protected open(): void {
    this.drawerOpen.set(true);
  }

  protected close(): void {
    this.drawerOpen.set(false);
  }
}
