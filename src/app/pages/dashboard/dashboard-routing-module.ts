import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LayoutComponent } from './layout/layout';
import { TicketListComponent } from './tickets/ticket-list/ticket.list'; 
import { TicketDetailComponent } from './tickets/ticket-detail/ticket-detail';  
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Ana iskeletimiz
    canActivate: [AuthGuard], // Güvenlik kapımız
    children: [
      // Alt rotalar (router-outlet içine yüklenecek olanlar)
      { path: '', redirectTo: 'my-tickets', pathMatch: 'full' }, 
      { path: 'my-tickets', component: TicketListComponent },
      { path: 'create-ticket', component: TicketCreateComponent },
      { path: 'all-tickets', component: TicketListComponent },
      // 🚀 DÜZELTME: 'tickets/:id' yerine 'ticket/:id' yaptık! (HTML ile birebir aynı)
      { path: 'ticket/:id', component: TicketDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }