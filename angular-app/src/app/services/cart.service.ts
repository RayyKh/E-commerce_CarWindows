import { Injectable, signal } from '@angular/core';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
  side?: string;
  fixation?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.load());

  private load(): CartItem[] {
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      const list: CartItem[] = JSON.parse(saved);
      return list.map((i) => ({
        ...i,
        image: i.image?.replace('via.placeholder.com', 'placehold.jp') || i.image,
      }));
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }

  addToCart(product: Product, quantity: number = 1, side?: string, fixation?: string) {
    const current = this.items();
    const existing = current.find((i) => 
      i.id === product.id && i.side === side && i.fixation === fixation
    );
    if (existing) {
      this.items.update((list) =>
        list.map((i) =>
          (i.id === product.id && i.side === side && i.fixation === fixation) 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        )
      );
    } else {
      this.items.update((list) => [...list, { ...product, quantity, side, fixation }]);
    }
    this.persist();
  }

  removeFromCart(productId: string, side?: string, fixation?: string) {
    this.items.update((list) => list.filter((i) => 
      !(i.id === productId && i.side === side && i.fixation === fixation)
    ));
    this.persist();
  }

  updateQuantity(productId: string, quantity: number, side?: string, fixation?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, side, fixation);
      return;
    }
    this.items.update((list) =>
      list.map((i) => 
        (i.id === productId && i.side === side && i.fixation === fixation) 
          ? { ...i, quantity } 
          : i
      )
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
