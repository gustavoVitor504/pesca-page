import { Router } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf, DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderResponse {
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

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf, DatePipe],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.scss'
})
export class OrdersHistoryComponent implements OnInit {

  private apiUrl = environment.apiUrl;
  pedidos: OrderResponse[] = [];
  carregando = true;

  constructor(
    private http: HttpClient,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('auth_token') || ''
      : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  carregarPedidos() {
    this.http.get<OrderResponse[]>(`${this.apiUrl}/orders`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.pedidos = data;
          this.carregando = false;
        },
        error: () => {
          this.carregando = false;
        }
      });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', CONFIRMED: 'Confirmado',
      SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  }
}