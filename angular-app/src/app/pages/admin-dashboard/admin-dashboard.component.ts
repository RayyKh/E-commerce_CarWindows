import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../environments/environment';
import { Product } from '../../data/products';
import { AuthApiService } from '../../services/auth-api.service';
import { ProductApiService } from '../../services/product-api.service';

Chart.register(...registerables);

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
  
  setActiveTab(tab: 'orders' | 'products' | 'revenue' | 'history') {
    this.activeTab.set(tab);
    if (tab === 'revenue') {
      setTimeout(() => this.loadRevenue(), 100);
    }
  }

  orders = signal<Order[]>([]);
  products = signal<any[]>([]);
  
  // Filtering & Pagination
  searchTerm = signal<string>('');
  selectedBrandFilter = signal<string>('all');
  selectedAvailabilityFilter = signal<string>('all');
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
  brandStats = signal<{ label: string; count: number; percent: number }[]>([]);
  
  revenueChart: any;
  
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
      const currentOrders = this.orders();
      const newOrders = res.reverse();
      
      if (currentOrders.length > 0 && newOrders.length > currentOrders.length) {
        // Notification sonore simple si possible ou visuelle
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.play().catch(() => {});
        alert('🔔 Nouvelle commande reçue !');
      }
      
      this.orders.set(newOrders);
    });
  }

  loadProducts() {
    const query = this.searchTerm().trim();
    const brand = this.selectedBrandFilter();
    const availability = this.selectedAvailabilityFilter();
    
    this.productApi.adminSearch(query, brand, this.currentPage(), this.pageSize, availability).subscribe(res => {
      this.products.set(res.content.map((p: any) => this.productApi.toFrontend(p)));
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
      
      const maxAmount = Math.max(...entries.map(e => e.amount), 1);
      this.monthlyTotal.set(maxAmount);
      this.updateRevenueChart(entries);
    });

    this.http.get<Record<string, number>>(`${this.base}/admin/dashboard/brand-distribution`).subscribe(map => {
      const entries = Object.entries(map).map(([label, count]) => ({ label, count }));
      const total = entries.reduce((acc, curr) => acc + curr.count, 0);
      const stats = entries.map(e => ({
        label: e.label,
        count: e.count,
        percent: total > 0 ? Math.round((e.count / total) * 100) : 0
      }));
      stats.sort((a, b) => b.count - a.count);
      this.brandStats.set(stats);
    });
  }

  updateRevenueChart(data: { label: string; amount: number }[]) {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: 'Revenu Mensuel (DT)',
          data: data.map(d => d.amount),
          backgroundColor: '#4cb0ff',
          hoverBackgroundColor: '#1F3A5F',
          borderRadius: 8,
          barThickness: 40,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1F3A5F',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 14 },
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => ` ${context.parsed.y} DT`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { 
              font: { size: 11, family: 'Inter' },
              callback: (value) => value + ' DT'
            }
          },
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Inter', weight: 'bold' } }
          }
        }
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.put(`${this.base}/admin/orders/${orderId}/status`, {}, { params: { status } }).subscribe(() => {
      this.loadOrders();
    });
  }

  // Product CRUD
  editProduct(p: Product) {
    this.editingProduct.set(p);
    this.productForm = { 
      nom: p.name || '',
      description: p.description || '',
      prix: p.price || 0,
      marqueVoiture: p.brand || '',
      modeleVoiture: p.model || '',
      annee: p.year || '',
      imageUrl: p.image || '',
      stock: p.stock || 0,
      status: p.availability || 'En stock'
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
              // On utilise un chemin relatif qui sera complété par le service avec l'IP dynamique
              p[key] = `/api/images/${filename.trim()}`;
            } else {
              p[key] = 'https://placehold.jp/600x400.png?text=SOS%20Rétro';
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
              // On utilise un chemin relatif qui sera complété par le service avec l'IP dynamique
              p[key] = `/api/images/${filename.trim()}`;
            } else {
              p[key] = 'https://placehold.jp/600x400.png?text=SOS%20Rétro';
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
