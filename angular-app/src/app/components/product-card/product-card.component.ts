import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart.service';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimateDirective],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(private cart: CartService) {}
  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.product) {
      this.cart.addToCart(this.product);
    }
  }
  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = 'https://placehold.jp/600x400.png?text=SOS%20Rétro';
  }
  availabilityClass(status: string) {
    switch (status) {
      case 'En stock':
        return 'text-green-600 bg-green-50';
      case 'Sur commande':
        return 'text-blue-600 bg-blue-50';
      case 'Épuisé':
      case 'Rupture':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}
