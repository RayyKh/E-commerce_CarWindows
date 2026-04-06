import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';

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
  update(item: CartItem, qty: number) {
    this.cart.updateQuantity(item.id, qty, item.side, item.fixation);
  }
  remove(item: CartItem) {
    this.cart.removeFromCart(item.id, item.side, item.fixation);
  }
  checkout() {
    this.router.navigate(['/commande']);
  }
}
