import { HttpErrorResponse } from '@angular/common/http';

/** Best-effort human message from a failed HTTP call (backend returns { error } / { fields }). */
export function errorMessage(err: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se pudo conectar con el servicio';
    const body = err.error as { error?: string } | string | null;
    if (typeof body === 'string' && body.trim()) return body;
    if (body && typeof body === 'object' && body.error) return body.error;
    return `Error ${err.status}`;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
