import { animate } from 'motion';

/**
 * Motion One helpers, reduced-motion aware. Motion One is layered in only for the sidebar
 * rail expand/collapse spring — everything else uses native CSS / Angular animate.enter.
 */

/** Spring tuned for the rail expand: quick settle, no overshoot wobble. */
const RAIL_SPRING = { type: 'spring', stiffness: 320, damping: 36, mass: 1 } as const;

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Spring an element's width to `px`. Honors reduced motion by setting it instantly. */
export function springWidth(el: HTMLElement, px: number): void {
  if (prefersReducedMotion()) {
    el.style.width = `${px}px`;
    return;
  }
  animate(el, { width: `${px}px` }, RAIL_SPRING);
}
