import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'; // Servisimizi aldık
import { UserLoginDto } from '../../../core/models/auth.model'; // DTO'muzu aldık
import { Router } from '@angular/router'; // Router'ı aldık   

@Component({
  selector: 'app-login',
  standalone: false, // Kurallarımız gereği standalone değil
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  // Dependency Injection (DI) kuralımıza uyarak servisi içeri alıyoruz
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // Form kurallara uygun değilse hiçbir şey yapma
    if (this.loginForm.invalid) {
      return;
    }

    // Gelen veriyi "Strict Type" olarak DTO'muza atıyoruz
    const loginData: UserLoginDto = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    console.log("Backend'e gönderiliyor...", loginData);

    // Component HTTP isteği atmaz, sadece servisi çağırır! (Single Responsibility)
    this.authService.login(loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Token'ı kaydet

        // 🚀 AKILLI YÖNLENDİRME (Trafik Polisi)
        const decoded = this.authService.getDecodedToken();
        const userRole = decoded ? decoded.role : null;

        if (userRole === 'Admin') {
          // Admin ise direkt Tüm Biletlere şutla
          this.router.navigate(['/dashboard/all-tickets']); 
        } else {
          // Normal kullanıcı ise Kendi Biletlerine şutla
          this.router.navigate(['/dashboard/my-tickets']); 
        }
      },
      error: (err) => alert("Giriş başarısız!")
    });
  }
}