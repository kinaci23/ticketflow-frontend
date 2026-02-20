export interface Ticket {
  ticketId: number;
  title: string;
  description: string;
  status: string;
  urgency: string;
  createdAt: Date;
  userName: string;
  predictedCategoryId?: number; // Soru işareti (?) koyduk çünkü null gelebilir
  finalCategoryId?: number;
  adminResponse?: string | null; // Admin'in eklediği açıklama, eğer varsa
}

export interface TicketCreateDto {
  title: string;
  description: string;
  urgency: string; 
}

export interface TicketUpdateDto {
  ticketId: number;
  status: string;
  finalCategoryId: number;
  adminResponse: string | null; // Admin'in eklediği açıklama, eğer varsa
} 

// 🚀 CHAT SİSTEMİ İÇİN YENİ EKLENEN MODELLER

// SQL'den bize gelecek olan mesajın formatı
export interface TicketMessage {
  messageId: number;
  ticketId: number;
  userId: number;
  messageText: string;
  createdAt: string | Date;
  senderName: string;
  senderRoleId: number; // 1: Admin, 2: User (Senin sistemindeki id'lere göre değişebilir)
}

// Bizim C#'a göndereceğimiz yeni mesaj paketi
export interface AddMessageDto {
  ticketId: number;
  messageText: string;
}