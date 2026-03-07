import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  create(items: OrderItemRequest[]): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.url, { items });
  }

  getAll(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.url);
  }
}