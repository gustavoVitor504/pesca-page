import { Component, OnInit , PLATFORM_ID , Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponentComponent } from './layout/Header/header-component/header-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponentComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const username = params.get('username');

      if (token) {
        localStorage.setItem('auth_token', token);
        if (username) localStorage.setItem('username', username);
        window.history.replaceState({}, '', '/');
        window.location.reload();
      }
    }
  }
}