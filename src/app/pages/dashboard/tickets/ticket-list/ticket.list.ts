import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket.model';
import { AuthService } from '../../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket.list.html'
})
export class TicketListComponent implements OnInit {
  tickets: any[] = []; // Backendden gelen tüm veriler
  displayedTickets: any[] = []; // Ekranda (tabloda) gösterilecek filtrelenmiş veriler
  userRole: string | null = null;
  
  selectedCategory: string = 'All'; // Dropdown'da seçili olan kategori
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.userRole = decoded ? decoded.role : null;
    
    this.loadTickets();

    // URL değişimlerini dinle ve tabloyu güncelle
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadTickets();
    });
  }

  loadTickets(): void {
    // Adminse DİREKT tüm biletleri getir, User ise sadece kendi biletlerini getir.
    const ticketObservable = this.userRole === 'Admin' 
      ? this.ticketService.getAllTickets() 
      : this.ticketService.getMyTickets();

    ticketObservable.subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilter(); // Veri gelir gelmez filtreyi uygula ve ekrana bas
      },
      error: (err) => {
        console.error("Biletler yüklenirken hata oluştu:", err);
        this.cdr.detectChanges();
      }
    });
  }

  // Kategori Dropdown'ından yeni bir seçim yapıldığında tetiklenir
  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }

  // Biletleri seçili kategoriye göre filtreler
  applyFilter(): void {
    if (this.selectedCategory === 'All') {
      this.displayedTickets = [...this.tickets];
    } else {
      this.displayedTickets = this.tickets.filter((t: any) => {
        const catId = t.finalCategoryId || t.predictedCategoryId || t.FinalCategoryId || t.PredictedCategoryId;
        return catId?.toString() === this.selectedCategory;
      });
    }
    this.cdr.detectChanges(); // Değişikliği anında ekrana yansıt
  }

  // Tablo başlıklarına tıklandığında sıralama yapar
  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.displayedTickets.sort((a: any, b: any) => {
      let valA, valB;

      if (column === 'categoryName') {
        valA = this.getCategoryName(a.finalCategoryId || a.predictedCategoryId || a.FinalCategoryId || a.PredictedCategoryId);
        valB = this.getCategoryName(b.finalCategoryId || b.predictedCategoryId || b.FinalCategoryId || b.PredictedCategoryId);
      } else {
        const keyPascal = column.charAt(0).toUpperCase() + column.slice(1);
        valA = a[column] || a[keyPascal] || '';
        valB = b[column] || b[keyPascal] || '';

        if (column === 'createdAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

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

  // 🚀 Durum Rengi Belirleyici (Tablo İçin)
  getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'çözüldü') return 'bg-emerald-500 text-white shadow-sm';
    if (s === 'açık') return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (s === 'işlemde') return 'bg-orange-50 text-orange-700 border border-orange-200';
    if (s === 'reddedildi') return 'bg-red-500 text-white shadow-sm';
    return 'bg-slate-100 text-slate-600';
  }

  // 🚀 Öncelik Rengi Belirleyici (Tablo İçin)
  getUrgencyClass(urgency: string): string {
    const u = urgency?.toLowerCase() || '';
    if (u === 'düşük') return 'bg-green-100 text-green-700';
    if (u === 'normal' || u === 'orta') return 'bg-yellow-100 text-yellow-800';
    if (u === 'yüksek' || u === 'acil') return 'bg-red-100 text-red-700 font-bold';
    return 'bg-slate-100 text-slate-600';
  }
}