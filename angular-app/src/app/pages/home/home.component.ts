import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HERO_IMAGE } from '../../components/assets/assets.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../data/products';
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

  // Predictive search
  protected readonly showSuggestions = signal(false);
  protected readonly suggestions = signal<Product[]>([]);

  protected readonly selectedBrand = signal<string>('all');
  protected readonly selectedModel = signal<string>('all');
  protected readonly selectedYear = signal<string>('all');

  protected readonly brandsSig = signal<string[]>([]);
  protected readonly models = signal<string[]>([]);
  protected readonly years = signal<string[]>([]);

  constructor(private router: Router, private api: ProductApiService, private title: Title, private meta: Meta) {
     this.title.setTitle('SOS Rétro - Spécialiste Rétroviseurs Automobiles en Tunisie');
     this.meta.updateTag({ name: 'description', content: 'SOS Rétro est votre expert en miroirs de rétroviseur en Tunisie. Trouvez la pièce exacte pour votre véhicule parmi plus de 2500 références.' });
    
    this.api.brands().subscribe((list) => this.brandsSig.set(list));
    this.api.list(0, 8, 'createdAt,desc').subscribe((page) => {
      this.featured.set(page.content.map(p => this.api.toFrontend(p)));
    });
  }
  onSearch(e: Event) {
    e.preventDefault();
    this.router.navigate(['/catalogue'], {
      queryParams: {
        brand: this.selectedBrand(),
        model: this.selectedModel(),
        year: this.selectedYear(),
        q: this.query(),
      },
    });
  }

  onQueryChange(val: string) {
    this.query.set(val);
    if (val.length >= 2) {
      this.api.searchPaged('all', 'all', 'all', 'all', val, 0, 5).subscribe(page => {
        const results = page.content.map(p => this.api.toFrontend(p));
        this.suggestions.set(results);
        this.showSuggestions.set(results.length > 0);
      });
    } else {
      this.showSuggestions.set(false);
    }
  }

  selectSuggestion(p: Product) {
    this.query.set(p.name);
    this.showSuggestions.set(false);
    this.router.navigate(['/produit', p.id]);
  }

  goToCatalog() {
    this.router.navigate(['/catalogue']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  onBrandChange(val: string) {
    this.selectedBrand.set(val);
    this.selectedModel.set('all');
    this.selectedYear.set('all');
    if (val === 'all') {
      this.models.set([]);
      this.years.set([]);
    } else {
      this.api.filterPaged(val, null, 0, 1000).subscribe((page) => {
        const ms = Array.from(new Set(page.content.map((p: any) => p.modeleVoiture))).sort();
        const ys = Array.from(new Set(page.content.map((p: any) => p.annee))).sort();
        this.models.set(ms);
        this.years.set(ys);
      });
    }
  }
}
