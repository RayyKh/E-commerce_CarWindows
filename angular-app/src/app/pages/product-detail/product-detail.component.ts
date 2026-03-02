import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart.service';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  protected readonly id = signal<string>('');
  protected readonly productSig = signal<Product | undefined>(undefined);
  protected readonly all = signal<Product[]>([]);
  protected readonly product = computed<Product | undefined>(() => this.productSig());
  protected readonly similar = computed(() =>
    this.all()
      .filter(
        (p) => p.id !== this.product()?.id && (p.type === this.product()?.type || p.brand === this.product()?.brand)
      )
      .slice(0, 4)
  );
  constructor(private cart: CartService, private route: ActivatedRoute, private api: ProductApiService) {
    this.id.set(this.route.snapshot.paramMap.get('id') ?? '');
    const id = this.id();
    if (id) {
      this.api.get(id).subscribe((p) => this.productSig.set(this.api.toFrontend(p as any)));
    }
    this.api.list(0, 24, 'createdAt,desc').subscribe((page) => {
      this.all.set(page.content.map((p) => this.api.toFrontend(p as any)));
    });
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
  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = 'https://placehold.jp/600x400.png?text=VitreAuto';
  }
}
