import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface OrderItemRequest {
  productId: number;
  quantity: number;
}
interface OrderRequest {
  products: OrderItemRequest[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}
interface ApiOrder {
  id: number;
  status: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}
  createOrder(req: OrderRequest) {
    return this.http.post<ApiOrder>(`${this.base}/orders`, req);
  }
}
