import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected readonly mobileMenuOpen = signal(false);
  readonly itemCount = computed(() => this.cart.getItemCount());
  constructor(private cart: CartService) {}
  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }
}
