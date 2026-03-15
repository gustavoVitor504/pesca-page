import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-page-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './product-page-detail.component.html',
  styleUrl: './product-page-detail.component.scss'
})
export class ProductPageDetailComponent implements OnInit {
  produto: Product | null = null;
  produtosRelacionados: Product[] = [];
  quantidade = 1;
  carregando = true;
  imagemAtiva = 0;
  todasImagens: string[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.carregarProduto(id);
    });
  }

  carregarProduto(id: number) {
    this.productService.getById(id).subscribe({
      next: (produto) => {
        this.produto = produto;
        // Monta array com imagem principal + adicionais
        this.todasImagens = [produto.image];
        if (produto.images) {
          const extras = produto.images.split(',').filter(u => u.trim());
          this.todasImagens.push(...extras);
        }
        this.imagemAtiva = 0;
        this.carregando = false;
        this.carregarRelacionados(produto.category, id);
      }
    });
  }

  carregarRelacionados(category: string, idAtual: number) {
    this.productService.getAll(category).subscribe({
      next: (produtos) => {
        this.produtosRelacionados = produtos
          .filter(p => p.id !== idAtual)
          .slice(0, 4);
      }
    });
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  incrementar() { if (this.quantidade < 10) this.quantidade++; }
  decrementar() { if (this.quantidade > 1) this.quantidade--; }

  adicionarAoCarrinho() {
    if (!this.produto) return;
    for (let i = 0; i < this.quantidade; i++) {
      this.cartService.addItem(this.produto);
    }
    this.router.navigate(['/carrinho']);
  }

  verDetalhes(id: number) {
    this.router.navigate(['/produto', id]);
    window.scrollTo(0, 0);
  }
}