import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HERO_IMAGE } from '../../components/assets/assets.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, products } from '../../data/products';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ScrollAnimateDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected readonly featured = signal<Product[]>([]);
  protected readonly query = signal('');
  protected readonly heroImage = HERO_IMAGE;

  protected readonly selectedBrand = signal<string>('all');
  protected readonly selectedModel = signal<string>('all');
  protected readonly selectedYear = signal<string>('all');

  protected readonly brandsSig = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly years = signal<string[]>([]);

  constructor(private router: Router, private api: ProductApiService) {
    this.api.brands().subscribe((list) => this.brandsSig.set(list));
    this.api.list(0, 8, 'createdAt,desc').subscribe((page) => {
      this.featured.set(page.content.map(p => this.api.toFrontend(p)));
    });
  }
  onSearch(e: Event) {
    e.preventDefault();
    const brand = this.selectedBrand();
    const model = this.selectedModel();
    const year = this.selectedYear();
    const params: any = {};
    if (brand !== 'all') params.brand = brand;
    if (model !== 'all') params.model = model;
    if (year !== 'all') params.year = year;
    const q = this.query().trim();
    if (q) params.q = q;
    this.router.navigate(['/catalogue'], { queryParams: params });
  }
  onBrandChange(val: string) {
    this.selectedBrand.set(val);
    this.selectedModel.set('all');
    this.selectedYear.set('all');
    if (val === 'all') {
      const ms = Array.from(new Set(products.map((p) => p.model))).sort();
      const ys = Array.from(new Set(products.map((p) => p.year))).sort();
      this.models.set(ms);
      this.years.set(ys);
    } else {
      this.api.filterPaged(val, null, 0, 100, 'createdAt,desc').subscribe((page) => {
        const ms = Array.from(new Set(page.content.map((p: any) => p.modeleVoiture))).sort();
        const ys = Array.from(new Set(page.content.map((p: any) => p.annee))).sort();
        this.models.set(ms);
        this.years.set(ys);
      });
    }
  }
}
