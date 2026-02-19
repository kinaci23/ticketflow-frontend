import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service'; // Servisimizi aldık
import { UserLoginDto } from '../../../core/models/auth.model'; // DTO'muzu aldık

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
    private authService: AuthService
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
      next: (response) => {
        // Başarılı olursa token'ı tarayıcıya kaydet ve haber ver
        console.log("🎉 Giriş Başarılı! Token:", response.token);
        localStorage.setItem('token', response.token);
        alert("Giriş Başarılı! Backend'den Token Alındı 🚀");
      },
      error: (err) => {
        // Hata olursa (şifre yanlış vs.) konsola bas
        console.error("❌ Login Hatası:", err);
        alert("Giriş Başarısız! Kullanıcı adı veya şifre hatalı.");
      }
    });
  }
}