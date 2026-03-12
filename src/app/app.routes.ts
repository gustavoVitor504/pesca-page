import { Routes } from '@angular/router';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

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
  }
];