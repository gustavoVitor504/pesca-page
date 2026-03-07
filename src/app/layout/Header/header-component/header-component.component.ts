import { Component } from '@angular/core';
import { LogoComponent } from '../logo-component/logo-component.component';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [LogoComponent, RouterLink, AsyncPipe, NgIf],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.scss'
})
export class HeaderComponentComponent {
  totalItems$ = this.cartService.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  constructor(private cartService: CartService) {}
}