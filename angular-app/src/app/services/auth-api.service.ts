import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string) {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, { email, password, fullName });
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  clearToken() {
    localStorage.removeItem('jwt');
  }
}
