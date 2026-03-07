import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = new BehaviorSubject<CartItem[]>([]);
  items$ = this.items.asObservable();

  get totalItems(): number {
    return this.items.getValue().reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.getValue().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  addItem(product: Product) {
    const current = this.items.getValue();
    const existing = current.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity++;
      this.items.next([...current]);
    } else {
      this.items.next([...current, { product, quantity: 1 }]);
    }
  }

  removeItem(productId: number) {
    this.items.next(this.items.getValue().filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const current = this.items.getValue();
    const item = current.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.items.next([...current]);
    }
  }

  clear() {
    this.items.next([]);
  }
}