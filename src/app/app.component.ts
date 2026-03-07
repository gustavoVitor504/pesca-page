import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponentComponent } from './layout/Header/header-component/header-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponentComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');

    if (token) {
      localStorage.setItem('auth_token', token);
      if (username) localStorage.setItem('username', username);
      // Limpa a URL sem recarregar a página
      window.history.replaceState({}, '', '/');
    }
  }
}