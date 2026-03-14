import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { FilterService, OrdemTipo } from '../../services/filter.service';
import { CartService } from '../../services/cart.service';
import { combineLatest } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-products',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf],
  templateUrl: './grid-products.component.html',
  styleUrl: './grid-products.component.scss'
})
export class GridProductsComponent implements OnInit {
  products: Product[] = [];
  produtosFiltrados: Product[] = [];
  carregando: boolean = true;
  busca: string = '';
  categorias: string[] = [];
  ordem: OrdemTipo = 'relevantes';

  constructor(
    private productService: ProductService,
    private filterService: FilterService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (produtos) => {
        this.products = produtos;
        this.carregando = false;

        combineLatest([
          this.filterService.categorias$,
          this.filterService.busca$,
          this.filterService.ordem$
        ]).subscribe(([categorias, busca, ordem]) => {
          this.categorias = categorias;
          this.busca = busca;
          this.ordem = ordem;
          this.aplicarFiltros();
        });
      },
      error: () => {
        this.carregando = false;
      }
    });
  }
   getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  aplicarFiltros() {
    let resultado = this.products.filter(produto => {
      const matchCategoria =
        this.categorias.length === 0 ||
        this.categorias.includes(produto.category);

      const matchBusca =
        produto.name.toLowerCase().includes(this.busca.toLowerCase());

      return matchCategoria && matchBusca;
    });

    // Ordenação
    if (this.ordem === 'menor-preco') {
      resultado = resultado.sort((a, b) => a.price - b.price);
    } else if (this.ordem === 'maior-preco') {
      resultado = resultado.sort((a, b) => b.price - a.price);
    }
    // 'relevantes' mantém ordem original do JSON

    this.produtosFiltrados = resultado;
  }

  adicionarAoCarrinho(produto: Product) {
    this.cartService.addItem(produto);
  }

  onOrdemChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as OrdemTipo;
    this.filterService.setOrdem(value);
  }
  verDetalhes(id: number) {
    this.router.navigate(['/produto', id]);
  }
}