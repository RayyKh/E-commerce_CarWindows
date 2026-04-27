import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderApiService } from '../../services/order-api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  readonly items = computed(() => this.cart.items());
  readonly total = computed(() => this.cart.getTotalPrice());
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  readonly form = {
    name: '',
    phone: '',
    address: '',
  };

  constructor(private cart: CartService, private orders: OrderApiService, private router: Router) {}

  confirm() {
    this.error.set(null);
    if (this.items().length === 0) {
      this.error.set('Votre panier est vide');
      return;
    }

    if (!this.form.name || !this.form.phone || !this.form.address) {
      this.error.set('Veuillez remplir tous les champs du formulaire');
      return;
    }

    this.submitting.set(true);
    const products = this.items().map((i) => ({ 
      productId: Number(i.id), 
      quantity: i.quantity,
      side: i.side,
      fixation: i.fixation
    }));
    this.orders
      .createOrder({
        products,
        customerName: this.form.name,
        customerPhone: this.form.phone,
        customerAddress: this.form.address,
      })
      .subscribe({
        next: (_) => {
          this.success.set(true);
          this.cart.clearCart();
        },
        error: (e) => {
          this.error.set(e?.error?.message || 'Verifier les données de la commande');
          this.submitting.set(false);
        },
      });
  }
}
