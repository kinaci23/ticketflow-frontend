import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Proje açıldığında direkt /auth adresine yönlendir
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  
  // LAZY LOADING: Auth modülünü sadece bu yola girildiğinde belleğe al
  { 
    path: 'auth', 
    loadChildren: () => import('./pages/auth/auth-module').then(m => m.AuthModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }