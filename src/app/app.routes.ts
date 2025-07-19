import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StockComponent } from './components/stock/stock.component';
import { AddShirtComponent } from './components/add-shirt/add-shirt.component';

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
];
