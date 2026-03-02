import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

interface OrderItem {
  id: number;
  product: { nom: string; marqueVoiture: string; modeleVoiture: string };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  dateCommande: string;
  status: string;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderItems: OrderItem[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  orders = signal<Order[]>([]);
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<Order[]>(`${this.base}/admin/orders`).subscribe((res) => {
      this.orders.set(res.reverse());
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.put(`${this.base}/admin/orders/${orderId}/status`, {}, { params: { status } }).subscribe(() => {
      this.loadOrders();
    });
  }

  statusClass(status: string) {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMEE': return 'bg-blue-100 text-blue-800';
      case 'LIVREE': return 'bg-green-100 text-green-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
