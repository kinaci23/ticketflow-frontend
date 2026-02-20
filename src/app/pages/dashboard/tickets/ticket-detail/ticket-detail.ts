import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🚀 Alarm zilini import ettik
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.html'
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading: boolean = true;
  selectedStatus: string = '';
  selectedCategory: number = 0;
  adminResponseText: string = '';
  isUpdating: boolean = false;
  selectedFinalCategory: number = 0;
  adminResponse: string = '';
  userRole: string | null = null;
  currentTicketId: number = 0;      
  messages: any[] = []; // Mesaj geçmişini tutacak liste
  newMessageText: string = ''; // Input'taki yeni mesaj metni
  isSendingMessage: boolean = false; // Gönderiliyor mu?
  currentUserId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef, // 🚀 Alarm zili hazır
    private authService: AuthService // 🚀 Kullanıcı rolünü almak için AuthService'i de ekleyelim
  ) {}

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.userRole = decoded ? decoded.role : null;
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.currentTicketId = Number(idParam);
        this.loadTicket(Number(idParam));
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadTicket(id: number): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Sayfaya yükleniyor animasyonunu bas

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // 🚀 SİHİRLİ DOKUNUŞ: Kargo geldi, F5 de atılsa HTML'i zorla güncelle!
        this.selectedStatus = data.status || data['status'] || 'Açık';
        this.selectedFinalCategory = data.finalCategoryId || data['finalCategoryId'] || data.predictedCategoryId || data['predictedCategoryId'] || 1;
        this.adminResponseText = data.adminResponse || data['adminResponse'] || '';
        
      },
      error: (err) => {
        console.error('Bilet çekilemedi:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Hata olsa bile ekranı kurtar
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  // 🤖 Yapay Zekanın ID'sini Metne Çeviren Yardımcı
  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'Tahmin Bekleniyor';
    
    switch (categoryId) {
      case 1: return 'Yazılım / Uygulama';
      case 2: return 'Donanım / Arıza';
      case 3: return 'Ağ ve İnternet';
      case 4: return 'Kullanıcı İşlemleri / Şifre';
      default: return `Kategori ${categoryId}`;
    }
  }

  // 🚀 Durum Rengi Belirleyici
  getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'çözüldü') return 'bg-emerald-500 text-white shadow-sm'; // İçi dolu, yeşil ve beyaz yazı
    if (s === 'açık') return 'bg-blue-50 text-blue-700 border border-blue-200'; // Açık mavi
    if (s === 'işlemde') return 'bg-orange-50 text-orange-700 border border-orange-200';
    if (s === 'reddedildi') return 'bg-red-500 text-white shadow-sm';
    return 'bg-slate-100 text-slate-600';
  }

  // 🚀 Öncelik Rengi Belirleyici
  getUrgencyClass(urgency: string): string {
    const u = urgency?.toLowerCase() || '';
    if (u === 'düşük') return 'bg-green-100 text-green-700'; // Yeşil
    if (u === 'normal' || u === 'orta') return 'bg-yellow-100 text-yellow-800'; // Sarı
    if (u === 'yüksek' || u === 'acil') return 'bg-red-100 text-red-700 font-bold'; // Kırmızı ve Kalın
    return 'bg-slate-100 text-slate-600';
  }

  // 🚀 BİLETİ GÜNCELLEME METODU
  // 🚀 GERÇEK BİLET GÜNCELLEME METODU
  updateTicket(): void {
    if (!this.ticket) return;

    this.isUpdating = true;

    const updateData: any = {
      ticketId: this.currentTicketId,
      status: this.selectedStatus,
      finalCategoryId: Number(this.selectedFinalCategory),
      adminResponse: this.adminResponseText
    };

    console.log("🚀 Güncelleme Paketi C#'a Gidiyor:", updateData);

    this.ticketService.updateTicket(updateData).subscribe({
      next: (res) => {
        console.log("✅ Bilet başarıyla güncellendi!", res);
        
        // Ekranda anında değişsin diye mevcut verileri eziyoruz
        this.ticket!.status = this.selectedStatus; 
        this.ticket!.finalCategoryId = Number(this.selectedFinalCategory);
        this.ticket!.adminResponse = this.adminResponseText; 
        
        this.isUpdating = false;
        // Şık bir kullanıcı deneyimi için basit bir uyarı
        alert("Bilet başarıyla güncellendi ve kullanıcıya iletildi!"); 
      },
      error: (err) => {
        this.isUpdating = false;
        console.error("❌ Güncelleme hatası:", err);
        alert("Bilet güncellenirken bir hata oluştu.");
      }
    });
  }
  loadMessages(ticketId: number): void {
    this.ticketService.getTicketMessages(ticketId).subscribe({
      next: (data) => {
        this.messages = data;
        this.cdr.detectChanges(); // Arayüzü tazele
      },
      error: (err) => console.error('Mesajlar yüklenemedi:', err)
    });
  }

  // 🚀 MESAJ GÖNDERME
  sendMessage(): void {
    if (!this.newMessageText.trim() || this.isSendingMessage) return;

    this.isSendingMessage = true;
    const messageDto = {
      ticketId: this.currentTicketId,
      messageText: this.newMessageText
    };

    this.ticketService.addTicketMessage(this.currentTicketId, messageDto).subscribe({
      next: (res) => {
        this.messages.push(res); // Yeni mesajı listeye ekle (Anlık görüntü)
        this.newMessageText = ''; // Input'u temizle
        this.isSendingMessage = false;
        this.cdr.detectChanges();
        // Sayfayı mesajların en altına kaydırmak için bir sonraki adımda kod ekleyeceğiz
      },
      error: (err) => {
        console.error('Mesaj gönderilemedi:', err);
        this.isSendingMessage = false;
      }
    });
  }
}