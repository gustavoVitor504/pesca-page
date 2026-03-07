import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, { name, email, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, { email, password }).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}