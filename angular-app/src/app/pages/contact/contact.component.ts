import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  readonly items = computed(() => this.cart.items());
  readonly total = computed(() => this.cart.getTotalPrice());
  readonly submitted = signal(false);
  form = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    message: '',
  };
  constructor(private cart: CartService) {}
  submit(e: Event) {
    e.preventDefault();
    const orderDetails =
      this.items().length > 0
        ? this.items()
            .map((i) => `- ${i.name} x${i.quantity} = ${i.price * i.quantity}€`)
            .join('\n') + `\nTotal: ${this.total()}€`
        : '';
    console.log('Form submitted:', { ...this.form, orderDetails });
    this.submitted.set(true);
    if (this.items().length > 0) {
      this.cart.clearCart();
    }
    setTimeout(() => {
      this.submitted.set(false);
      this.form = { firstName: '', lastName: '', phone: '', address: '', message: '' };
    }, 3000);
  }
}
