import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // 🚀 v4 için doğru import
// Tüm modellerimizi tek seferde içeri alıyoruz
import { UserLoginDto, UserRegisterDto, AuthResponseDto, TokenPayload } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
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

  // 🚀 YENİ METODLAR SINIFIN İÇİNDE OLMALI:
  getDecodedToken(): TokenPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date.valueOf() > new Date().valueOf();
  }
} // ⚠️ Sınıfın en son parantezi burada olmalı!