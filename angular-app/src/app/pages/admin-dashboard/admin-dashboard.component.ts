import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ProductApiService } from '../../services/product-api.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  activeTab = signal<'orders' | 'products'>('orders');
  orders = signal<Order[]>([]);
  products = signal<any[]>([]);
  
  // Product Form
  editingProduct = signal<any | null>(null);
  productForm = {
    nom: '',
    description: '',
    prix: 0,
    marqueVoiture: '',
    modeleVoiture: '',
    annee: '',
    imageUrl: '',
    stock: 0
  };

  private base = environment.apiUrl;

  constructor(private http: HttpClient, private productApi: ProductApiService) {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders() {
    this.http.get<Order[]>(`${this.base}/admin/orders`).subscribe((res) => {
      this.orders.set(res.reverse());
    });
  }

  loadProducts() {
    this.productApi.list(0, 100).subscribe(res => {
      this.products.set(res.content);
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.put(`${this.base}/admin/orders/${orderId}/status`, {}, { params: { status } }).subscribe(() => {
      this.loadOrders();
    });
  }

  // Product CRUD
  editProduct(p: any) {
    this.editingProduct.set(p);
    this.productForm = { ...p };
  }

  cancelEdit() {
    this.editingProduct.set(null);
    this.resetProductForm();
  }

  resetProductForm() {
    this.productForm = {
      nom: '',
      description: '',
      prix: 0,
      marqueVoiture: '',
      modeleVoiture: '',
      annee: '',
      imageUrl: '',
      stock: 0
    };
  }

  saveProduct() {
    const p = this.editingProduct();
    if (p) {
      this.productApi.adminUpdate(p.id, this.productForm).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
      });
    } else {
      this.productApi.adminCreate(this.productForm).subscribe(() => {
        this.loadProducts();
        this.resetProductForm();
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productApi.adminDelete(id).subscribe(() => {
        this.loadProducts();
      });
    }
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
