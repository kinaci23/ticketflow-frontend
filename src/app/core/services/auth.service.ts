// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginDto, UserRegisterDto, AuthResponseDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root' // Singleton: Uygulama boyunca tek bir instance (kopya) çalışır.
})
export class AuthService {
  private apiUrl = 'https://localhost:7139/api/Auth'; 

  constructor(private http: HttpClient) {}

  login(userData: UserLoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, userData);
  }

  register(userData: UserRegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, userData);
  }
}