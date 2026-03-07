import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar/side-bar.component';
import { GridProductsComponent } from "../../components/grid-products/grid-products.component";
import { SubHeaderComponent } from "../../layout/sub-header/sub-header/sub-header.component";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [SideBarComponent, GridProductsComponent, SubHeaderComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

}
