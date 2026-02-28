import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { products } from '../../data/products';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  protected readonly selectedBrand = signal<string>('all');
  protected readonly selectedType = signal<string>('all');
  protected readonly selectedAvailability = signal<string>('all');

  readonly brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  readonly types = Array.from(new Set(products.map((p) => p.type))).sort();

  protected readonly filtered = computed(() =>
    products.filter((product) => {
      const sb = this.selectedBrand();
      const st = this.selectedType();
      const sa = this.selectedAvailability();
      if (sb !== 'all' && product.brand !== sb) return false;
      if (st !== 'all' && product.type !== st) return false;
      if (sa !== 'all' && product.availability !== sa) return false;
      return true;
    })
  );
}
