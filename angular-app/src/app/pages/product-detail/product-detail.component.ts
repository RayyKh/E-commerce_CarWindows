import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, products } from '../../data/products';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  protected readonly id = signal<string>('');
  protected readonly product = computed<Product | undefined>(() =>
    products.find((p) => p.id === this.id())
  );
  protected readonly similar = computed(() =>
    products
      .filter(
        (p) => p.id !== this.product()?.id && (p.type === this.product()?.type || p.brand === this.product()?.brand)
      )
      .slice(0, 4)
  );
  constructor(private cart: CartService, private route: ActivatedRoute) {
    this.id.set(this.route.snapshot.paramMap.get('id') ?? '');
  }
  addToCart() {
    const p = this.product();
    if (p) {
      this.cart.addToCart(p);
    }
  }
  availabilityClass(status: string) {
    switch (status) {
      case 'En stock':
        return 'text-green-600 bg-green-50';
      case 'Sur commande':
        return 'text-orange-600 bg-orange-50';
      case 'Rupture':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}
