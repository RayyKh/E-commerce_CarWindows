import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthApiService } from '../../services/auth-api.service';
import { ProductApiService } from '../../services/product-api.service';

interface OrderItem {
  id: number;
  product: { nom: string; marqueVoiture: string; modeleVoiture: string };
  quantity: number;
  price: number;
  side?: string;
  fixation?: string;
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

interface ProductForm {
  nom: string;
  description: string;
  prix: number;
  marqueVoiture: string;
  modeleVoiture: string;
  annee: string;
  imageUrl: string;
  stock: number;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  activeTab = signal<'orders' | 'products' | 'revenue' | 'history'>('orders');
  orders = signal<Order[]>([]);
  products = signal<any[]>([]);
  
  // Filtering & Pagination
  searchTerm = signal<string>('');
  selectedBrandFilter = signal<string>('all');
  currentPage = signal<number>(0);
  pageSize = 10;
  totalPages = signal<number>(0);
  totalProducts = signal<number>(0);
  csvFiles = signal<string[]>([]);

  totalRevenue = signal<number>(0);
  totalOrders = signal<number>(0);
  totalClients = signal<number>(0);
  monthlyRevenue = signal<{ label: string; amount: number }[]>([]);
  monthlyTotal = signal<number>(0);
  
  brands = [
    "ALFA ROMEO", "AUDI", "BMW", "CHEVROLET", "CHRYSLER", "CITROEN", "DACIA", "DAEWOO", "DAIHATSU",
    "DODGE", "DS", "FIAT", "FORD", "HONDA", "HYUNDAI", "IVECO", "JAGUAR", "JEEP", "KIA", "LANCIA",
    "LAND ROVER", "LEXUS", "MAZDA", "MERCEDES", "MINI", "MITSUBISHI", "NISSAN", "OPEL", "PEUGEOT",
    "PORSCHE", "RENAULT", "SAAB", "SEAT", "SKODA", "SMART", "SSANGYONG", "SUBARU", "SUZUKI", "TOYOTA",
    "VOLKSWAGEN", "VOLVO"
  ];

  // Product Form
  editingProduct = signal<any | null>(null);
  productForm: ProductForm = {
    nom: '',
    description: '',
    prix: 0,
    marqueVoiture: '',
    modeleVoiture: '',
    annee: '',
    imageUrl: '',
    stock: 0,
    status: 'En stock'
  };

  private base = environment.apiUrl;

  private refreshTimer: any = null;
  constructor(private http: HttpClient, private productApi: ProductApiService, private auth: AuthApiService, private router: Router) {}

  ngOnInit() {
    this.loadOrders();
    this.loadProducts();
    this.loadCSVFiles();
    this.loadRevenue();
    this.refreshTimer = setInterval(() => {
      this.loadOrders();
      this.loadRevenue();
    }, 5000);
  }

  loadCSVFiles() {
    this.productApi.getCSVFiles().subscribe(files => {
      this.csvFiles.set(files);
    });
  }

  deleteCSVFile(filename: string) {
    if (confirm(`Supprimer le fichier ${filename} ?`)) {
      this.productApi.deleteCSVFile(filename).subscribe(() => {
        this.loadCSVFiles();
      });
    }
  }
  ngOnDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  logout() {
    this.auth.clearToken();
    this.router.navigate(['/espace-pro']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadOrders() {
    this.http.get<Order[]>(`${this.base}/admin/orders`).subscribe((res) => {
      this.orders.set(res.reverse());
    });
  }

  loadProducts() {
    const query = this.searchTerm().trim();
    const brand = this.selectedBrandFilter();
    
    this.productApi.adminSearch(query, brand, this.currentPage(), this.pageSize).subscribe(res => {
      this.products.set(res.content);
      this.totalPages.set(res.totalPages);
      this.totalProducts.set(res.totalElements);
    });
  }

  onFilterChange() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  filteredProducts = computed(() => this.products());
  
  loadRevenue() {
    this.http.get<number>(`${this.base}/admin/dashboard/total-revenue`).subscribe(v => this.totalRevenue.set(v));
    this.http.get<number>(`${this.base}/admin/dashboard/total-orders`).subscribe(v => this.totalOrders.set(v));
    this.http.get<number>(`${this.base}/admin/dashboard/total-clients`).subscribe(v => this.totalClients.set(v));
    this.http.get<Record<string, number>>(`${this.base}/admin/dashboard/monthly-revenue`).subscribe(map => {
      const entries = Object.entries(map).map(([label, amount]) => ({ label, amount }));
      entries.sort((a, b) => a.label.localeCompare(b.label));
      this.monthlyRevenue.set(entries);
      const now = new Date();
      const year = now.getFullYear();
      const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
      const key = `${year}-${monthName}`;
      const found = entries.find(e => e.label === key);
      this.monthlyTotal.set(found ? found.amount : 0);
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
    this.productForm = { 
      nom: p.nom || '',
      description: p.description || '',
      prix: p.prix || 0,
      marqueVoiture: p.marqueVoiture || '',
      modeleVoiture: p.modeleVoiture || '',
      annee: p.annee || '',
      imageUrl: p.imageUrl || '',
      stock: p.stock || 0,
      status: p.status || 'En stock'
    };
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
      stock: 0,
      status: 'En stock'
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

  deleteAllProducts() {
    if (confirm('ATTENTION : Êtes-vous sûr de vouloir supprimer TOUS les produits du catalogue ? Cette action est irréversible.')) {
      this.productApi.adminDeleteAll().subscribe(() => {
        this.loadProducts();
      });
    }
  }

  async importFromCSV(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // First upload to server
    this.productApi.uploadCSV(file).subscribe(() => {
      this.loadCSVFiles();
      
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const content = e.target.result;
        const lines = content.split('\n');
        const header = lines[0].split(';');
        
        const productsToImport = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(';');
        const p: any = {};
        header.forEach((col: string, idx: number) => {
          const key = col.trim();
          let val = values[idx]?.trim() || '';
          if (key === 'prix' || key === 'stock') {
            p[key] = parseFloat(val) || 0;
            if (key === 'stock') {
              if (p[key] === 0) p['status'] = 'Épuisé';
              else if (p[key] >= 1) p['status'] = 'En stock';
            }
          } else if (key === 'imageUrl') {
            // Transform filenames to accessible API URLs
            const filename = val.split('/').pop() || val.split('\\').pop();
            if (filename && filename.trim() !== '') {
              p[key] = `http://localhost:8081/api/images/${filename.trim()}`;
            } else {
              p[key] = 'https://placehold.jp/600x400.png?text=VitreAuto';
            }
          } else {
            p[key] = val;
          }
        });
        productsToImport.push(p);
        }

        if (confirm(`Voulez-vous importer ${productsToImport.length} produits ?`)) {
          let count = 0;
          for (const p of productsToImport) {
            try {
              await this.productApi.adminCreate(p).toPromise();
              count++;
            } catch (err) {
              console.error('Erreur import produit:', p.nom, err);
            }
          }
          alert(`${count} produits importés avec succès !`);
          this.loadProducts();
        }
      };
      reader.readAsText(file);
    });
  }

  async importExistingCSV(filename: string) {
    this.productApi.downloadCSV(filename).subscribe(async (blob: Blob) => {
      const text = await blob.text();
      const lines = text.split('\n');
      const header = lines[0].split(';');
      
      const productsToImport = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(';');
        const p: any = {};
        header.forEach((col: string, idx: number) => {
          const key = col.trim();
          let val = values[idx]?.trim() || '';
          if (key === 'prix' || key === 'stock') {
            p[key] = parseFloat(val) || 0;
            if (key === 'stock') {
              if (p[key] === 0) p['status'] = 'Épuisé';
              else if (p[key] >= 1) p['status'] = 'En stock';
            }
          } else if (key === 'imageUrl') {
            // If image path starts with /images/, transform it to our API endpoint
            const filename = val.split('/').pop() || val.split('\\').pop();
            if (filename && filename.trim() !== '') {
              p[key] = `http://localhost:8081/api/images/${filename.trim()}`;
            } else {
              p[key] = 'https://placehold.jp/600x400.png?text=VitreAuto';
            }
          } else {
            p[key] = val;
          }
        });
        productsToImport.push(p);
      }

      if (confirm(`Voulez-vous importer ${productsToImport.length} produits à partir du fichier ${filename} ?`)) {
        let count = 0;
        for (const p of productsToImport) {
          try {
            await this.productApi.adminCreate(p).toPromise();
            count++;
          } catch (err) {
            console.error('Erreur import produit:', p.nom, err);
          }
        }
        alert(`${count} produits importés avec succès !`);
        this.loadProducts();
      }
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
  
  showRevenueTab() {
    this.activeTab.set('revenue');
  }
}
