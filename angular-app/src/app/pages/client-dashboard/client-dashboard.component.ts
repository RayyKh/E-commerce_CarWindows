import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderApiService } from '../../services/order-api.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent {
  protected readonly phone = signal('');
  protected readonly orders = signal<any[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor(private ordersApi: OrderApiService) {}

  fetchByPhone() {
    this.error.set(null);
    const p = this.phone().trim();
    if (!p) {
      this.error.set('Veuillez entrer votre numéro de téléphone');
      return;
    }
    this.loading.set(true);
    this.ordersApi.ordersByPhone(p).subscribe({
      next: (list) => {
        this.orders.set(list.reverse());
        this.loading.set(false);
      },
      error: (_) => {
        this.error.set('Impossible de récupérer vos commandes');
        this.loading.set(false);
      },
    });
  }

  statusClass(status: string) {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMEE': return 'bg-blue-100 text-blue-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
