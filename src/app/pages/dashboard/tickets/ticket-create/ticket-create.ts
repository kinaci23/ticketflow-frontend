import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TicketCreateDto } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: false,
  templateUrl: './ticket-create.html' // Kendi html adına göre düzelt
})
export class TicketCreateComponent implements OnInit {
  ticketForm!: FormGroup;
  isSubmitting: boolean = false; // Gönder butonuna basılınca loading animasyonu için

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🚀 FORM KURALLARI: Hepsi zorunlu, başlık en az 5 karakter olmalı!
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      urgency: ['Normal', Validators.required] // Varsayılan olarak 'Normal' seçili gelsin
    });
  }

  onSubmit(): void {
    // Eğer kullanıcı zorunlu alanları boş bıraktıysa işlemi durdur
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched(); // Hata mesajlarını ekranda kızartarak göster
      return;
    }

    this.isSubmitting = true; // Yükleniyor animasyonunu başlat

    // Formdaki verileri paketle
    const newTicket: TicketCreateDto = {
      title: this.ticketForm.value.title,
      description: this.ticketForm.value.description,
      urgency: this.ticketForm.value.urgency
    };

    console.log("🚀 Yapay Zeka'ya ve Backend'e kargo çıkıyor...", newTicket);

    // Servis üzerinden C#'a gönder
    this.ticketService.createTicket(newTicket).subscribe({
      next: (res) => {
        console.log("✅ Bilet başarıyla oluşturuldu!", res);
        this.isSubmitting = false;
        
        // Başarılı olursa kullanıcının biletleri ekranına geri yönlendir
        this.router.navigate(['/dashboard/my-tickets']);
      },
      error: (err) => {
        console.error("❌ Bilet oluşturulurken hata:", err);
        alert("Bilet oluşturulamadı. Backend çalışıyor mu?");
        this.isSubmitting = false;
      }
    });
  }

  // İptal butonuna basılırsa geri dön
  goBack(): void {
    this.router.navigate(['/dashboard/my-tickets']);
  }
}