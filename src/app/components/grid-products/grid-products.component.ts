import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { FilterService, OrdemTipo } from '../../services/filter.service';
import { CartService } from '../../services/cart.service';
import { combineLatest } from 'rxjs';

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
  busca: string = '';
  categorias: string[] = [];
  ordem: OrdemTipo = 'relevantes';

  constructor(
    private http: HttpClient,
    private filterService: FilterService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.http.get<Product[]>('assets/data/products.json').subscribe(data => {
      this.products = data;

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
    });
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
}