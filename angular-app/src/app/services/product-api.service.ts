import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../data/products';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

interface ApiProduct {
  id: number;
  nom: string;
  description: string;
  prix: number;
  marqueVoiture: string;
  modeleVoiture: string;
  annee: string;
  imageUrl: string;
  stock: number;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  toFrontend(p: ApiProduct): Product {
    let img = p.imageUrl || 'assets/placeholder-auto.jpg';
    
    // Si l'URL contient localhost:8081 (ancienne importation erronée), on la corrige dynamiquement
    if (img.includes('localhost:8081') && window.location.hostname !== 'localhost') {
      img = img.replace('localhost:8081', `${window.location.hostname}:8081`);
    } else if (img.startsWith('/')) {
      // Utiliser l'adresse de base de l'API qui est déjà configurée avec la bonne IP et le bon port
      img = `${this.base}${img}`;
    }
    
    return {
      id: String(p.id),
      name: p.nom || 'Produit sans nom',
      description: p.description || '',
      price: p.prix || 0,
      brand: p.marqueVoiture || 'Inconnue',
      model: p.modeleVoiture || '',
      year: p.annee || '',
      image: img,
      type: 'Pare-brise',
      availability: (p.status || (p.stock > 0 ? 'En stock' : 'Rupture')) as any,
      category: 'Standard',
      stock: p.stock
    };
  }

  list(page = 0, size = 12, sort = 'createdAt,desc') {
    return this.http.get<PageResponse<ApiProduct>>(`${this.base}/products`, {
      params: { page, size, sort },
    });
  }

  adminSearch(query: string = '', marque: string = 'all', page: number = 0, size: number = 10, availability: string = 'all') {
    let url = `${this.base}/admin/products/search?page=${page}&size=${size}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (marque && marque !== 'all') url += `&marque=${encodeURIComponent(marque)}`;
    if (availability && availability !== 'all') url += `&availability=${encodeURIComponent(availability)}`;
    return this.http.get<any>(url);
  }

  searchPaged(marque: string = 'all', modele: string = 'all', annee: string = 'all', availability: string = 'all', query: string = '', page = 0, size = 12, sort = 'createdAt,desc') {
    let url = `${this.base}/products/search?page=${page}&size=${size}&sort=${sort}`;
    if (marque && marque !== 'all') url += `&marque=${encodeURIComponent(marque)}`;
    if (modele && modele !== 'all') url += `&modele=${encodeURIComponent(modele)}`;
    if (annee && annee !== 'all') url += `&annee=${encodeURIComponent(annee)}`;
    if (availability && availability !== 'all') url += `&availability=${encodeURIComponent(availability)}`;
    if (query) url += `&query=${encodeURIComponent(query)}`;
    return this.http.get<PageResponse<ApiProduct>>(url);
  }

  get(id: string) {
    return this.http.get<ApiProduct>(`${this.base}/products/${id}`);
  }

  filterPaged(marque: string, modele: string | null, page = 0, size = 12, sort = 'createdAt,desc') {
    const params: any = { marque, page, size, sort };
    if (modele) params.modele = modele;
    return this.http.get<PageResponse<ApiProduct>>(`${this.base}/products/filter`, { params });
  }

  brands() {
    return this.http.get<string[]>(`${this.base}/products/brands`);
  }

  adminCreate(p: any) {
    return this.http.post<ApiProduct>(`${this.base}/admin/products`, p);
  }

  adminUpdate(id: string, p: any) {
    return this.http.put<ApiProduct>(`${this.base}/admin/products/${id}`, p);
  }

  adminDelete(id: string) {
    return this.http.delete(`${this.base}/admin/products/${id}`);
  }

  adminDeleteAll() {
    return this.http.delete(`${this.base}/admin/products/all`);
  }

  // Files management
  uploadCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.base}/admin/files/upload`, formData, { responseType: 'text' });
  }

  getCSVFiles() {
    return this.http.get<string[]>(`${this.base}/admin/files`);
  }

  deleteCSVFile(filename: string) {
    return this.http.delete(`${this.base}/admin/files/${filename}`, { responseType: 'text' });
  }

  downloadCSV(filename: string) {
    return this.http.get(`${this.base}/admin/files/${filename}`, { responseType: 'blob' });
  }
}
