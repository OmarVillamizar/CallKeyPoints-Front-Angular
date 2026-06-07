import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorFileText,
  phosphorGearSix,
  phosphorMagnifyingGlass,
  phosphorPlus,
  phosphorPushPin,
  phosphorPushPinSlash,
  phosphorSignOut,
  phosphorTrash,
  phosphorX,
} from '@ng-icons/phosphor-icons/regular';
import { AuthService } from '../../core/auth/auth.service';
import { CallsStore } from '../../core/stores/calls.store';
import { formatRelative } from '../../core/util/format';
import { springWidth } from '../../core/util/motion';

const RAIL = 64;
const OPEN = 288;
const PIN_KEY = 'ckp:sidebar-pinned';

/**
 * Icon-rail sidebar — the app's centerpiece and session manager.
 *
 * - `rail` mode: collapsed to icons (64px); pointer hover springs it open (288px) as a
 *   floating overlay; a pin button locks it open (persisted to localStorage) and commits
 *   the layout width so content reflows. The expand spring is Motion One; everything else
 *   is CSS gated by `is-expanded`.
 * - `drawer` mode: always open, with a close button — used inside the mobile off-canvas drawer.
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  viewProviders: [
    provideIcons({
      phosphorFileText,
      phosphorGearSix,
      phosphorMagnifyingGlass,
      phosphorPlus,
      phosphorPushPin,
      phosphorPushPinSlash,
      phosphorSignOut,
      phosphorTrash,
      phosphorX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: {
    '[class.is-drawer]': 'isDrawer()',
    '[class.is-expanded]': 'expanded()',
    '[class.is-floating]': 'floating()',
    '[style.width.px]': 'hostWidth()',
    '(pointerenter)': 'onEnter()',
    '(pointerleave)': 'onLeave()',
  },
})
export class Sidebar {
  readonly mode = input<'rail' | 'drawer'>('rail');
  readonly navigate = output<void>();
  readonly dismiss = output<void>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly store = inject(CallsStore);

  protected readonly email = this.auth.email;
  protected readonly initial = computed(() => (this.email() ?? '?').charAt(0) || '?');

  protected readonly query = signal('');
  protected readonly pinned = signal(this.restorePin());
  private readonly hovering = signal(false);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private settled = false;

  protected readonly isDrawer = computed(() => this.mode() === 'drawer');
  protected readonly expanded = computed(() => this.isDrawer() || this.pinned() || this.hovering());
  protected readonly floating = computed(
    () => this.mode() === 'rail' && !this.pinned() && this.hovering(),
  );
  protected readonly hostWidth = computed(() =>
    this.isDrawer() || this.pinned() ? OPEN : RAIL,
  );

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const calls = this.store.calls();
    return q ? calls.filter((c) => c.title.toLowerCase().includes(q)) : calls;
  });

  protected readonly relative = formatRelative;

  constructor() {
    // Spring the rail panel width on expand/collapse. Drawer mode is fixed-width (CSS), and
    // the very first settle (e.g. a pinned reload) is applied instantly to avoid an open-gap.
    effect(() => {
      const target = this.expanded() ? OPEN : RAIL;
      const el = this.panel()?.nativeElement;
      if (!el) return;
      if (this.isDrawer() || !this.settled) {
        el.style.width = `${this.isDrawer() ? OPEN : target}px`;
        this.settled = true;
        return;
      }
      springWidth(el, target);
    });

    // Persist pin state.
    effect(() => {
      const pinned = this.pinned();
      try {
        localStorage.setItem(PIN_KEY, pinned ? '1' : '0');
      } catch {
        /* storage unavailable (private mode) — pin is best-effort */
      }
    });
  }

  private restorePin(): boolean {
    try {
      return localStorage.getItem(PIN_KEY) === '1';
    } catch {
      return false;
    }
  }

  protected onEnter(): void {
    if (this.mode() === 'rail') this.hovering.set(true);
  }

  protected onLeave(): void {
    if (this.mode() === 'rail') this.hovering.set(false);
  }

  protected togglePin(): void {
    this.pinned.update((v) => !v);
  }

  protected onLink(): void {
    this.navigate.emit();
  }

  protected async remove(event: Event, id: number): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('¿Eliminar este caso? Esta acción no se puede deshacer.')) return;
    try {
      await this.store.remove(id);
      if (this.router.url === `/calls/${id}`) await this.router.navigateByUrl('/new');
    } catch {
      alert('No se pudo eliminar el caso.');
    }
  }

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
