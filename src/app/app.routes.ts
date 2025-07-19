import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockComponent } from './components/stock/stock.component';
import { AddShirtComponent } from './components/add-shirt/add-shirt.component';
import { SalesComponent } from './components/sales/sales.component';
import { AddManualSaleComponent } from './components/add-manual-sale/add-manual-sale.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'stock',
    component: StockComponent,
  },
  {
    path: 'add-shirt',
    component: AddShirtComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
  },
  {
    path: 'add-manual-sale',
    component: AddManualSaleComponent,
  },
];
