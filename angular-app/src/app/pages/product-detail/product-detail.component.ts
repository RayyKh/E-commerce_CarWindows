import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../data/products';
import { CartService } from '../../services/cart.service';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  protected readonly id = signal<string>('');
  protected readonly productSig = signal<Product | undefined>(undefined);
  protected readonly all = signal<Product[]>([]);
  protected readonly product = computed<Product | undefined>(() => this.productSig());
  
  protected readonly quantity = signal<number>(1);
   protected readonly selectedSide = signal<string>('gauche / conducteur');
   protected readonly selectedFixation = signal<string>('Clipsable');
   protected readonly activeTab = signal<string>('description');
   protected readonly showZoom = signal(false);

   protected readonly similar = computed(() =>
    this.all()
      .filter(
        (p) => p.id !== this.product()?.id && (p.type === this.product()?.type || p.brand === this.product()?.brand)
      )
      .slice(0, 4)
  );
  constructor(private cart: CartService, private route: ActivatedRoute, private api: ProductApiService) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newId = params.get('id') ?? '';
      this.id.set(newId);
      if (newId) {
        this.api.get(newId).subscribe((p) => {
          this.productSig.set(this.api.toFrontend(p as any));
          window.scrollTo(0, 0); // Scroll to top when product changes
        });
      }
    });

    this.api.list(0, 24, 'createdAt,desc').subscribe((page) => {
      this.all.set(page.content.map((p) => this.api.toFrontend(p as any)));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cart.addToCart(p, this.quantity(), this.selectedSide(), this.selectedFixation());
    }
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
  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = 'https://placehold.jp/600x400.png?text=VitreAuto';
  }
}
