import type { Tone } from '../models/tone';

/** Lowercase + strip accents, for tolerant keyword matching on LLM free text. */
const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Severity -> tone. alta/critica = alert, media = warn, baja = ok. */
export function severidadTone(v?: string): Tone {
  if (!v) return 'neutral';
  const s = norm(v);
  if (s.includes('alta') || s.includes('critic') || s.includes('grave')) return 'alert';
  if (s.includes('media') || s.includes('moder')) return 'warn';
  if (s.includes('baja') || s.includes('leve')) return 'ok';
  return 'neutral';
}

/** Resolution state -> tone. resuelto = ok, escalado/orden = accent, pendiente = warn. */
export function estadoTone(v?: string): Tone {
  if (!v) return 'neutral';
  const s = norm(v);
  if (s.includes('resuelt') || s.includes('cerrad') || s.includes('solucion')) return 'ok';
  if (s.includes('escalad') || s.includes('orden') || s.includes('trabajo')) return 'accent';
  if (s.includes('pendient') || s.includes('proceso') || s.includes('espera')) return 'warn';
  return 'neutral';
}

/** Customer sentiment -> tone. */
export function sentimientoTone(v?: string): Tone {
  if (!v) return 'neutral';
  const s = norm(v);
  if (s.includes('satisf') || s.includes('content') || s.includes('positiv') || s.includes('agradec'))
    return 'ok';
  if (
    s.includes('molest') ||
    s.includes('insatisf') ||
    s.includes('enojad') ||
    s.includes('frustrad') ||
    s.includes('negativ')
  )
    return 'alert';
  return 'neutral';
}

/** Protocol compliance -> tone. */
export function cumplimientoTone(v?: string): Tone {
  if (!v) return 'neutral';
  const s = norm(v);
  if (s.includes('no cumple') || s.includes('incumpl')) return 'alert';
  if (s.includes('parcial')) return 'warn';
  if (s.includes('cumple')) return 'ok';
  return 'neutral';
}

/** Responsibility -> tone (informational). */
export function responsabilidadTone(v?: string): Tone {
  if (!v) return 'neutral';
  const s = norm(v);
  if (s.includes('empresa') || s.includes('red')) return 'accent';
  if (s.includes('cliente')) return 'warn';
  return 'neutral';
}

const LONG = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const SHORT = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' });

export function formatLong(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return LONG.format(d);
}

/** Relative time in Spanish for the call list (ahora, hace 5 min, ayer, 3 jun). */
export function formatRelative(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.round(hr / 24);
  if (day === 1) return 'ayer';
  if (day < 7) return `hace ${day} d`;
  return SHORT.format(d);
}
