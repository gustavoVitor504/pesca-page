import { Routes } from '@angular/router';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductPageComponent
  },
  {
    path: 'carrinho',
    component: CartPageComponent
  }
];