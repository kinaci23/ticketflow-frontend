import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.html'
})
export class TopbarComponent implements OnInit {
  username: string | undefined = '';
  userRole: string | null = null; // 🚀 Rol değişkenini ekledik

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.username = decoded?.username;
    this.userRole = decoded?.role || null; // 🚀 Rolü token'dan alıyoruz
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}