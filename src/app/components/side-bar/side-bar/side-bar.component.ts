import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'side-bar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  categorias = ['Varas', 'Iscas', 'Acessórios', 'Linhas', 'Molinetes'];
  categoriasSelecionadas: string[] = [];
  todasMarcadas: boolean = true; // ← começa com "Todas" marcado

  constructor(private filterService: FilterService) {}

  onTodasChange() {
    // Ao clicar em "Todas", desmarca tudo e envia array vazio
    this.todasMarcadas = true;
    this.categoriasSelecionadas = [];
    this.filterService.setCategorias([]);
  }

  onCategoriaChange(categoria: string, checked: boolean) {
    if (checked) {
      this.todasMarcadas = false; // desmarca "Todas"
      this.categoriasSelecionadas.push(categoria);
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c !== categoria);
      
      // Se desmarcar tudo, volta para "Todas"
      if (this.categoriasSelecionadas.length === 0) {
        this.todasMarcadas = true;
      }
    }
    this.filterService.setCategorias([...this.categoriasSelecionadas]);
  }

  isSelecionada(cat: string): boolean {
    return this.categoriasSelecionadas.includes(cat);
  }
}