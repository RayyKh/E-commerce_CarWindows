import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { products } from '../../data/products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected readonly featured = products.slice(0, 8);
  protected readonly query = signal('');
  constructor(private router: Router) {}
  onSearch(e: Event) {
    e.preventDefault();
    const q = this.query().trim();
    this.router.navigate(['/catalogue'], { queryParams: q ? { q } : {} });
  }
}
