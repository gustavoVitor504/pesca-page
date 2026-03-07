// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');

    if (token) {
      return true;
    }

    // Não logado — redireciona para o login-page
    const isProd = window.location.hostname !== 'localhost';
    const loginUrl = isProd
      ? 'https://login-page.vercel.app'
      : 'http://localhost:4201';

    window.location.href = loginUrl;
    return false;
  }
}