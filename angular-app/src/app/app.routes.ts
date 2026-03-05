import { Routes } from '@angular/router';
import { AssetsComponent } from './components/assets/assets.component';
import { adminGuard } from './guards/admin.guard';
import { LayoutComponent } from './layout/layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CartComponent } from './pages/cart/cart.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
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
      { path: 'assets', component: AssetsComponent },
      { path: 'mes-commandes', component: ClientDashboardComponent },
      { path: 'espace-pro', component: LoginComponent },
      { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
