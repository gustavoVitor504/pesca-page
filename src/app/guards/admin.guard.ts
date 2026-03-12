import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const AdminGuard = (): boolean => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return false;

  const token = localStorage.getItem('auth_token');
  if (!token) {
    router.navigate(['/']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'ROLE_ADMIN') {
        return true;
    }
  } catch {}

  router.navigate(['/']);
  return false;
};