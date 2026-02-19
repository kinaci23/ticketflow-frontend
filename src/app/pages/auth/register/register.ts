import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRegisterDto } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: false, // Kurallarımız gereği standalone değil
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  // Servislerimizi (DI) içeri alıyoruz
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Kayıt formunun kuralları (Validasyonlar)
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email formatı kontrolü eklendi
      password: ['', [Validators.required, Validators.minLength(6)]] // Şifre min 6 karakter olsun
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const registerData: UserRegisterDto = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        alert("Kayıt Başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        // 🚀 BAŞARILI KAYIT SONRASI OTOMATİK YÖNLENDİRME
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {
        console.error("❌ Kayıt Hatası:", err);
        alert("Kayıt Başarısız! Bilgileri kontrol edin.");
      }
    });
  }
}