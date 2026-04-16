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
  protected readonly selectedModel = signal<string>('all');
  protected readonly selectedYear = signal<string>('all');
  protected readonly query = signal<string>('');
  protected readonly productsSig = signal<Product[]>([]);
  protected readonly page = signal<number>(0);
  protected readonly size = signal<number>(12);
  protected readonly totalPages = signal<number>(0);
  protected readonly totalProducts = signal<number>(0);
  protected readonly brandsSig = signal<string[]>([]);
  protected readonly modelsSig = signal<string[]>([]);
  protected readonly showMobileFilters = signal(false);

  protected readonly filtered = computed(() => this.productsSig());
  constructor(private route: ActivatedRoute, private router: Router, private api: ProductApiService) {
    const qp = this.route.snapshot.queryParamMap;
    this.query.set(qp.get('q') ?? '');
    this.selectedBrand.set(qp.get('brand') ?? 'all');
    this.selectedModel.set(qp.get('model') ?? 'all');
    this.selectedYear.set(qp.get('year') ?? 'all');
    this.selectedType.set(qp.get('type') ?? 'all');
    this.selectedAvailability.set(qp.get('availability') ?? 'all');
    
    this.loadPage(0);
    this.api.brands().subscribe((list) => this.brandsSig.set(list));
    this.updateModels();
  }

  updateModels() {
    const brand = this.selectedBrand();
    if (brand === 'all') {
      this.modelsSig.set([]);
    } else {
      this.api.filterPaged(brand, null, 0, 1000).subscribe(page => {
        const models = Array.from(new Set(page.content.map(p => p.modeleVoiture))).sort();
        this.modelsSig.set(models);
      });
    }
  }

  loadPage(pg: number) {
    const brand = this.selectedBrand();
    const model = this.selectedModel();
    const year = this.selectedYear();
    const availability = this.selectedAvailability();
    const query = this.query();
    const size = this.size();

    this.api.searchPaged(brand, model, year, availability, query, pg, size).subscribe((page) => {
      this.page.set(page.number);
      this.totalPages.set(page.totalPages);
      this.totalProducts.set(page.totalElements);
      this.productsSig.set(page.content.map((p) => this.api.toFrontend(p as any)));
      // Scroll to top of list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onFilterChange() {
    this.loadPage(0);
    // Update URL query params without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        brand: this.selectedBrand(),
        model: this.selectedModel(),
        year: this.selectedYear(),
        availability: this.selectedAvailability(),
        q: this.query()
      },
      queryParamsHandling: 'merge'
    });
  }

  onBrandChange(val: string) {
    this.selectedBrand.set(val);
    this.selectedModel.set('all'); // Reset model when brand changes
    this.updateModels();
    this.onFilterChange();
  }

  onModelChange(val: string) {
    this.selectedModel.set(val);
    this.onFilterChange();
  }

  onYearChange(val: string) {
    this.selectedYear.set(val);
    this.onFilterChange();
  }

  onAvailabilityChange(val: string) {
    this.selectedAvailability.set(val);
    this.onFilterChange();
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
