import { Routes } from '@angular/router';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { AdminGuard } from './guards/admin.guard';
import { VerifyEmailPageComponent } from './pages/verify-email-page/verify-email-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductPageComponent
  },
  {
    path: 'carrinho',
    component: CartPageComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'checkout', 
    component: CheckoutPageComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(m => m.AdminPageComponent),
    canActivate: [AdminGuard]
  },
  { 
    path: 'verificar-email', 
    component: VerifyEmailPageComponent 
  },
  { 
    path: 'produto/:id', 
    component: ProductPageDetailComponent 
  }
];