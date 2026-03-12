import { Component, OnInit , PLATFORM_ID , Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('auth_token');
      this.username = localStorage.getItem('username') || '';
    }
  }
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
    }
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
  irParaLogin() {
    if (isPlatformBrowser(this.platformId)) {
      const isProd = window.location.hostname !== 'localhost';
      window.location.href = isProd
        ? 'https://login-page-silk-sigma.vercel.app'
        : 'http://localhost:4201';
    }
  }
  toggleMenu() {
  this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }
}