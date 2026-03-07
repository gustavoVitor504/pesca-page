import { Component } from '@angular/core';

@Component({
  selector: 'logo-component',
  standalone: true,
  imports: [],
  templateUrl: './logo-component.component.html',
  styleUrl: './logo-component.component.scss'
})
export class LogoComponent {
  logo = 'assets/img/logo.png';
}
