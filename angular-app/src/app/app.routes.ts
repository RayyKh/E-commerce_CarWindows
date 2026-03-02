import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './pages/cart/cart.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'catalogue', component: CatalogComponent },
      { path: 'produit/:id', component: ProductDetailComponent },
      { path: 'panier', component: CartComponent },
      { path: 'commande', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
