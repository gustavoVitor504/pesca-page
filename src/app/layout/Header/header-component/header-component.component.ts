import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../logo-component/logo-component.component';
import { RouterLink , Router } from '@angular/router';
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
export class HeaderComponentComponent implements OnInit {

  menuAberto = false; 

  totalItems$ = this.cartService.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  isLoggedIn = false;
  username = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    this.username = localStorage.getItem('username') || '';
  }
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
  irParaLogin() {
    const isProd = window.location.hostname !== 'localhost';
    window.location.href = isProd
      ? 'https://login-page.vercel.app'
      : 'http://localhost:4201';
  }
  toggleMenu() {
  this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }
}