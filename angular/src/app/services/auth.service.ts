import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'employee';
    timezone: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  register(name: string, email: string, password: string, timezone: string) {
    return this.api.post<{ message: string; user: AuthResponse['user'] }>('/auth/register', {
      name,
      email,
      password,
      role: 'employee',
      timezone
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  get user() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  get isAuthenticated() {
    return Boolean(localStorage.getItem('token'));
  }
}
