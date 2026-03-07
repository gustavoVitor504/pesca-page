import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type OrdemTipo = 'relevantes' | 'menor-preco' | 'maior-preco';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private busca = new BehaviorSubject<string>('');
  busca$ = this.busca.asObservable();

  private categoriasSelecionadas = new BehaviorSubject<string[]>([]);
  categorias$ = this.categoriasSelecionadas.asObservable();

  private ordem = new BehaviorSubject<OrdemTipo>('relevantes');
  ordem$ = this.ordem.asObservable();

  setCategorias(categorias: string[]) {
    this.categoriasSelecionadas.next(categorias);
  }

  setBusca(busca: string) {
    this.busca.next(busca);
  }

  setOrdem(ordem: OrdemTipo) {
    this.ordem.next(ordem);
  }
}