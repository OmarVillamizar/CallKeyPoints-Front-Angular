import { inject } from '@angular/core';
import { type HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Central HTTP error handling: an expired/invalid token (401) bounces the user to /login.
 * The error is re-thrown so callers (stores, resources) can still surface a message.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        void router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
