import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string) {
    return this.api.post<{ token: string; user: any }>('/auth/login', { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
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
