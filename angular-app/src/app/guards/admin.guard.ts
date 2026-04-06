import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payloadJson = JSON.parse(atob(parts[1]));
    return payloadJson['role'] || null;
  } catch {
    return null;
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = getRoleFromToken(localStorage.getItem('jwt'));
  if (role === 'ADMIN') return true;
  return router.parseUrl('/espace-pro') as UrlTree;
};
