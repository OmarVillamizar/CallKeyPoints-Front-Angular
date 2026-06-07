import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CallsStore } from '../../core/stores/calls.store';

/**
 * TEMPORARY Phase-1 landing. Verifies the full loop: guard -> session signal -> auth
 * interceptor -> CallsStore httpResource. Replaced by the app shell + sidebar in Phase 2.
 */
@Component({
  selector: 'app-home',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly calls = inject(CallsStore);
  protected readonly email = this.auth.email;

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
