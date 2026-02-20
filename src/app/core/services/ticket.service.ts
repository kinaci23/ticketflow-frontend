import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketCreateDto, TicketUpdateDto, TicketMessage, AddMessageDto } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7139/api/Tickets'; // Backend URL'ni kontrol et

  constructor(private http: HttpClient) {}

  // Kullanıcının kendi biletlerini getirir
  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/my-tickets`);
  }

  // Sadece Admin: Tüm sistemdeki biletleri getirir
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/all-tickets`);
  }

  // Yeni bilet oluşturur
  createTicket(ticketData: TicketCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, ticketData);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  updateTicket(ticketData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, ticketData);
  }
  
  getTicketMessages(ticketId: number): Observable<TicketMessage[]> {
    return this.http.get<TicketMessage[]>(`${this.apiUrl}/${ticketId}/messages`);
  }

  // 2. Bilete yeni bir mesaj gönderir
  addTicketMessage(ticketId: number, messageDto: AddMessageDto): Observable<TicketMessage> {
    return this.http.post<TicketMessage>(`${this.apiUrl}/${ticketId}/messages`, messageDto);
  }
  
}