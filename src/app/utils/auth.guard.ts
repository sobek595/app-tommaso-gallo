import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return authSrv.isAuthenticated$
    .pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['/login']);
        }
      })
    );
};
