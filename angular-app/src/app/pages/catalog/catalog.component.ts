import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../data/products';
import { ProductApiService } from '../../services/product-api.service';

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
  protected readonly query = signal<string>('');
  protected readonly productsSig = signal<Product[]>([]);
  protected readonly page = signal<number>(0);
  protected readonly size = signal<number>(12);
  protected readonly totalPages = signal<number>(0);
  protected readonly brandsSig = signal<string[]>([]);

  readonly types = computed(() => Array.from(new Set(this.productsSig().map((p) => p.type))).sort());

  protected readonly filtered = computed(() =>
    this.productsSig().filter((product) => {
      const sb = this.selectedBrand();
      const st = this.selectedType();
      const sa = this.selectedAvailability();
      const q = this.query().toLowerCase().trim();
      if (q) {
        const text = `${product.name} ${product.brand} ${product.model} ${product.type} ${product.year} ${product.category}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (sb !== 'all' && product.brand !== sb) return false;
      if (st !== 'all' && product.type !== st) return false;
      if (sa !== 'all' && product.availability !== sa) return false;
      return true;
    })
  );
  constructor(private route: ActivatedRoute, private router: Router, private api: ProductApiService) {
    const q = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.query.set(q);
    this.loadPage(0);
    this.api.brands().subscribe((list) => this.brandsSig.set(list));
  }
  loadPage(pg: number) {
    const brand = this.selectedBrand();
    const size = this.size();
    if (brand === 'all') {
      this.api.list(pg, size, 'createdAt,desc').subscribe((page) => {
        this.page.set(page.number);
        this.totalPages.set(page.totalPages);
        this.productsSig.set(page.content.map((p) => this.api.toFrontend(p as any)));
      });
    } else {
      this.api.filterPaged(brand, null, pg, size, 'createdAt,desc').subscribe((page) => {
        this.page.set(page.number);
        this.totalPages.set(page.totalPages);
        this.productsSig.set(page.content.map((p) => this.api.toFrontend(p as any)));
      });
    }
  }
  onBrandChange(val: string) {
    this.selectedBrand.set(val);
    this.loadPage(0);
  }
  next() {
    const p = this.page();
    const tp = this.totalPages();
    if (p + 1 < tp) this.loadPage(p + 1);
  }
  prev() {
    const p = this.page();
    if (p > 0) this.loadPage(p - 1);
  }
}
