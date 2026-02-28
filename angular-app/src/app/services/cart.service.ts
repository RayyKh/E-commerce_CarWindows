import { Injectable, signal } from '@angular/core';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.load());

  private load(): CartItem[] {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }

  addToCart(product: Product) {
    const current = this.items();
    const existing = current.find((i) => i.id === product.id);
    if (existing) {
      this.items.update((list) =>
        list.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      this.items.update((list) => [...list, { ...product, quantity: 1 }]);
    }
    this.persist();
  }

  removeFromCart(productId: string) {
    this.items.update((list) => list.filter((i) => i.id !== productId));
    this.persist();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.items.update((list) =>
      list.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
    this.persist();
  }

  clearCart() {
    this.items.set([]);
    this.persist();
  }

  getTotalPrice(): number {
    return this.items().reduce((t, i) => t + i.price * i.quantity, 0);
  }

  getItemCount(): number {
    return this.items().reduce((c, i) => c + i.quantity, 0);
  }
}
