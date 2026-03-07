import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'sub-header',
  standalone: true,
  imports: [CurrencyPipe, NgFor],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss'
})
export class SubHeaderComponent {

  constructor(private filterService: FilterService) {}

  buscar(event: any) {
    const busca = event.target.value;
    this.filterService.setBusca(busca);
  }

}
