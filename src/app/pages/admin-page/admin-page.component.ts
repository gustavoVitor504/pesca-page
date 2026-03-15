import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CurrencyPipe, DatePipe, SlicePipe, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string;
  discount?: number;
  rating?: number;
  stock?: number;
}

interface OrderSummary {
  id: number;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, DatePipe, SlicePipe, RouterLink],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {

  activeTab: 'dashboard' | 'products' | 'orders' = 'dashboard';
  sidebarCollapsed = false;
  adminName = '';
  private supabaseUrl = 'https://btiyteqfytudpbswxgzd.supabase.co/storage/v1/object/public/products/';
  private supabaseUploadUrl = 'https://btiyteqfytudpbswxgzd.supabase.co/storage/v1/object/products/';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXl0ZXFmeXR1ZHBic3d4Z3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTg4NDksImV4cCI6MjA4ODM5NDg0OX0.lFknnGhJNkKcRg49iY2HcwKFV-iBO4Bs_P1wPWhTbHQ';

  // Dashboard
  stats: DashboardStats | null = null;

  // Produtos
  produtos: Product[] = [];
  buscaProduto = '';
  modalAberto = false;
  modalDeleteAberto = false;
  produtoEditando: Partial<Product> = {};
  produtoParaDeletar: Product | null = null;
  salvando = false;
  imagensAdicionais: string[] = [];
  uploadingImagem = false;  

  // Pedidos
  pedidos: OrderSummary[] = [];
  filtroStatus = '';

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      this.adminName = localStorage.getItem('username') || 'Admin';

      if (!token) {
        this.router.navigate(['/']);
        return;
      }
    }
    this.carregarDashboard();
  }

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('auth_token') || ''
      : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ===== DASHBOARD =====
  carregarDashboard() {
    this.http.get<DashboardStats>(`${this.apiUrl}/admin/dashboard`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.stats = data,
        error: (err) => {
          if (err.status === 403) this.router.navigate(['/']);
        }
      });
  }

  // ===== PRODUTOS =====
  carregarProdutos() {
    this.http.get<Product[]>(`${this.apiUrl}/admin/products`, { headers: this.getHeaders() })
      .subscribe(data => this.produtos = data);
  }

  get produtosFiltrados(): Product[] {
    if (!this.buscaProduto) return this.produtos;
    const b = this.buscaProduto.toLowerCase();
    return this.produtos.filter(p =>
      p.name.toLowerCase().includes(b) || p.category.toLowerCase().includes(b)
    );
  }

  abrirFormProduto(produto?: Product) {
    this.produtoEditando = produto ? { ...produto } : {
      name: '', description: '', price: 0, category: '',
      image: '', stock: 0, rating: 5, discount: 0
    };
    // Carrega imagens adicionais existentes
    this.imagensAdicionais = this.produtoEditando.images
      ? this.produtoEditando.images.split(',').filter(u => u.trim())
      : [];
    this.modalAberto = true;
  }

  editarProduto(produto: Product) {
    this.abrirFormProduto(produto);
  }

  fecharModal() {
    this.modalAberto = false;
    this.produtoEditando = {};
  }

  salvarProduto() {
    this.salvando = true;
    this.produtoEditando.images = this.imagensAdicionais.join(',');
    const isEdit = !!this.produtoEditando.id;
    const url = isEdit
      ? `${this.apiUrl}/admin/products/${this.produtoEditando.id}`
      : `${this.apiUrl}/admin/products`;
    const req = isEdit
      ? this.http.put<Product>(url, this.produtoEditando, { headers: this.getHeaders() })
      : this.http.post<Product>(url, this.produtoEditando, { headers: this.getHeaders() });

    req.subscribe({
      next: (produto) => {
        if (isEdit) {
          const idx = this.produtos.findIndex(p => p.id === produto.id);
          if (idx !== -1) this.produtos[idx] = produto;
        } else {
          this.produtos.unshift(produto);
        }
        this.salvando = false;
        this.fecharModal();
        this.carregarDashboard();
      },
      error: () => { this.salvando = false; }
    });
  }

  confirmarDelete(produto: Product) {
    this.produtoParaDeletar = produto;
    this.modalDeleteAberto = true;
  }

  deletarProduto() {
    if (!this.produtoParaDeletar) return;
    this.http.delete(`${this.apiUrl}/admin/products/${this.produtoParaDeletar.id}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.produtos = this.produtos.filter(p => p.id !== this.produtoParaDeletar!.id);
          this.modalDeleteAberto = false;
          this.produtoParaDeletar = null;
          this.carregarDashboard();
        }
      });
  }
  async uploadImagem(event: Event, tipo: 'principal' | 'adicional') {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.uploadingImagem = true;
    const file = input.files[0];
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;

    try {
      const res = await fetch(`${this.supabaseUploadUrl}${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
          'apikey': this.supabaseKey,
          'Content-Type': file.type,
        },
        body: file
      });

      if (res.ok) {
        const url = `${this.supabaseUrl}${fileName}`;
        if (tipo === 'principal') {
          this.produtoEditando.image = url;
        } else {
          this.imagensAdicionais.push(url);
        }
      }
    } catch (e) {
      console.error('Erro no upload:', e);
    } finally {
      this.uploadingImagem = false;
      input.value = '';
    }
  }
  removerImagemAdicional(index: number) {
    this.imagensAdicionais.splice(index, 1);
  }

  // ===== PEDIDOS =====
  carregarPedidos() {
    this.http.get<OrderSummary[]>(`${this.apiUrl}/admin/orders`, { headers: this.getHeaders() })
      .subscribe(data => this.pedidos = data);
  }

  get pedidosFiltrados(): OrderSummary[] {
    if (!this.filtroStatus) return this.pedidos;
    return this.pedidos.filter(o => o.status === this.filtroStatus);
  }

  atualizarStatus(order: OrderSummary, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.http.put(`${this.apiUrl}/admin/orders/${order.id}/status`, { status }, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          order.status = status;
          this.carregarDashboard();
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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
    }
    this.router.navigate(['/']);
  }
}