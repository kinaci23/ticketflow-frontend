import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Yol ver, geçsin
    } else {
      // Dur yolcu! Giriş sayfasına geri git.
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}