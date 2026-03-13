import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  post<T>(path: string, payload: unknown, auth = false) {
    return this.http.post<T>(`${this.baseUrl}${path}`, payload, auth ? { headers: this.headers } : {});
  }

  get<T>(path: string, auth = false) {
    return this.http.get<T>(`${this.baseUrl}${path}`, auth ? { headers: this.headers } : {});
  }

  put<T>(path: string, payload: unknown, auth = false) {
    return this.http.put<T>(`${this.baseUrl}${path}`, payload, auth ? { headers: this.headers } : {});
  }
}
