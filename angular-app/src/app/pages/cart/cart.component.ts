import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  readonly items = computed(() => this.cart.items());
  readonly total = computed(() => this.cart.getTotalPrice());
  constructor(private cart: CartService, private router: Router) {}
  update(id: string, qty: number) {
    this.cart.updateQuantity(id, qty);
  }
  remove(id: string) {
    this.cart.removeFromCart(id);
  }
  checkout() {
    this.router.navigate(['/contact']);
  }
}
