import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService, PaymentRequest, PaymentResponse } from '../../services/payment.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../environments/environment.production';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, AsyncPipe, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {

  // Método de pagamento
  metodoPagamento: 'pix' | 'cartao' | 'boleto' = 'pix';

  // Dados do cartão
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  installments = 1;
  focusCvv = false;

  // Dados do pagador
  email = '';
  cpf = '';

  // Estado
  carregando = false;
  resultado: PaymentResponse | null = null;

  // Items do carrinho
  items$ = this.cartService.items$;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.email = localStorage.getItem('username') || '';

    // Carrega o SDK do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      (window as any).mp = new (window as any).MercadoPago(environment.mpPublicKey, {
        locale: 'pt-BR'
      });
    };
    document.head.appendChild(script);
  }
}

async gerarTokenCartao(): Promise<string> {
  const mp = (window as any).mp;
  if (!mp) throw new Error('SDK do MP não carregado');

  const result = await mp.createCardToken({
    cardNumber: this.cardNumber.replace(/\s/g, ''),
    cardholderName: this.cardName,
    cardExpirationMonth: this.cardExpiry.split('/')[0],
    cardExpirationYear: '20' + this.cardExpiry.split('/')[1],
    securityCode: this.cardCvv,
    identificationType: 'CPF',
    identificationNumber: this.cpf.replace(/\D/g, '')
  });

  if (result.error) throw new Error(result.error);
  return result.id; // esse é o cardToken
}

  get total(): number {
    return this.cartService.currentItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity, 0
    );
  }

  async pagar() {
    if (!this.email || !this.cpf) {
      alert('Preencha seu e-mail e CPF para continuar.');
      return;
    }

    this.carregando = true;

    try {
    // Gera token do cartão se for pagamento com cartão
    let cardToken: string | undefined;
    if (this.metodoPagamento === 'cartao') {
      cardToken = await this.gerarTokenCartao();
    }

    const items = this.cartService.currentItems.map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    }));

    this.orderService.create(items).subscribe({
      next: (pedido) => {
        const request: PaymentRequest = {
          paymentMethodId: this.metodoPagamento === 'cartao' ? 'visa' : this.metodoPagamento,
          token: cardToken, // ← agora é o token real
          installments: this.installments,
          transactionAmount: this.total,
          description: 'Compra Tuvira & Tevaro',
          orderId: pedido.id,
          payer: {
            email: this.email,
            firstName: 'Cliente',
            lastName: 'Pesca',
            identification: {
              type: 'CPF',
              number: this.cpf.replace(/\D/g, '')
            }
          }
        };

        this.paymentService.createPayment(request).subscribe({
          next: (res) => {
            this.resultado = res;
            this.carregando = false;
            if (res.status === 'approved') {
              this.cartService.clear();
              setTimeout(() => this.router.navigate(['/']), 3000);
            }
          },
          error: () => {
            this.carregando = false;
            alert('Erro ao processar pagamento. Tente novamente.');
          }
        });
      },
      error: () => {
        this.carregando = false;
        alert('Erro ao criar pedido.');
      }
    });

    } catch (e: any) {
      this.carregando = false;
      alert('Erro ao tokenizar cartão: ' + e.message);
    }
  }

  copiarPix() {
    if (isPlatformBrowser(this.platformId) && this.resultado?.qrCode) {
      navigator.clipboard.writeText(this.resultado.qrCode);
      alert('Código PIX copiado!');
    }
  }
}