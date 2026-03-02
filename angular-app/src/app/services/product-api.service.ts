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
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  toFrontend(p: ApiProduct): Product {
    return {
      id: String(p.id),
      name: p.nom,
      description: p.description,
      price: p.prix,
      brand: p.marqueVoiture,
      model: p.modeleVoiture,
      year: p.annee,
      image: p.imageUrl,
      type: 'Pare-brise',
      availability: p.stock > 0 ? 'En stock' : 'Rupture',
      category: 'Standard',
    };
  }

  list(page = 0, size = 12, sort = 'createdAt,desc') {
    return this.http.get<PageResponse<ApiProduct>>(`${this.base}/products`, {
      params: { page, size, sort },
    });
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
}
