import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

/**
 * Tiny toast store. Components push transient success/error messages; the ToastHost renders the
 * stack. Auto-dismisses after a tone-dependent delay, manual dismiss clears the pending timer.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private seq = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  success(message: string, ms = 3200): void {
    this.push('success', message, ms);
  }

  error(message: string, ms = 5000): void {
    this.push('error', message, ms);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(tone: ToastTone, message: string, ms: number): void {
    const id = ++this.seq;
    this._toasts.update((list) => [...list, { id, tone, message }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), ms),
    );
  }
}
