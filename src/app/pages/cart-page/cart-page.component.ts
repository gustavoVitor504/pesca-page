import { Component } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { CurrencyPipe, NgFor, NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, AsyncPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  items$ = this.cartService.items$;

  constructor(
    public cartService: CartService, 
    private orderService: OrderService
  ) {}

  remover(id: number) {
    this.cartService.removeItem(id);
  }

  incrementar(id: number, quantidade: number) {
  this.cartService.updateQuantity(id, quantidade + 1);
  }

  decrementar(id: number, quantidade: number) {
  this.cartService.updateQuantity(id, quantidade - 1);
  } 

  limpar() {
    this.cartService.clear();
  }

  total(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
  finalizarCompra() {
    const items = this.cartService.currentItems.map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    }));

    this.orderService.create(items).subscribe({
      next: (pedido) => {
        alert(`Pedido #${pedido.id} criado com sucesso!`);
        this.cartService.clear();
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Faça login para finalizar o pedido.');
        }
      }
    });
  }
}