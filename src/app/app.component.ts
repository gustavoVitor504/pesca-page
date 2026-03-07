import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponentComponent } from './layout/Header/header-component/header-component.component';
import { SubHeaderComponent } from './layout/sub-header/sub-header/sub-header.component';
import { ProductPageComponent } from "./pages/product-page/product-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponentComponent, SubHeaderComponent, ProductPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pesca-page';
}
