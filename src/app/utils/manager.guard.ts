import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';
import { UserRole } from '../entities/User';

export const managerGuard: CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return authSrv.currentUser$.pipe(
    take(1),
    map(user => {
      if (user?.role === UserRole.MANAGER) {
        return true;
      }
      return router.createUrlTree(['/homepage']);
    })
  );
};
