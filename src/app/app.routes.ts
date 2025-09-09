import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockComponent } from './components/stock/stock.component';
import { AddShirtStockComponent } from './components/add-shirt/add-shirt-stock.component';
import { SalesComponent } from './components/sales/sales.component';
import { AddManualSaleComponent } from './components/add-manual-sale/add-manual-sale.component';
import { ConfigComponent } from './components/config/config.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddAdmComponent } from './components/config/add-adm/add-adm.component';
import { authGuard } from './guards/auth.guard';
import { AddCustomerComponent } from './components/customers/add-customer/add-customer.component';
import { EditStockComponent } from './components/edit-stock/edit-stock.component';
import { ShirtVisualizationComponent } from './components/shirt-visualization/shirt-visualization.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-shirt',
    component: AddShirtStockComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-manual-sale',
    component: AddManualSaleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'config',
    component: ConfigComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-adm',
    component: AddAdmComponent,
    canActivate: [authGuard],
  },
  {
    path: 'add-customer',
    component: AddCustomerComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stock/:id',
    component: EditStockComponent,
    canActivate: [authGuard],
  },
  {
    path: 'shirt-visualization/:identificator',
    component: ShirtVisualizationComponent,
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
