import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentRequest {
  paymentMethodId: string;
  token?: string;
  installments: number;
  transactionAmount: number;
  description: string;
  orderId: number;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    identification: { type: string; number: string };
  };
}

export interface PaymentResponse {
  status: string;
  statusDetail: string;
  paymentId: number;
  qrCode?: string;
  qrCodeBase64?: string;
  boletoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.url, request);
  }
}