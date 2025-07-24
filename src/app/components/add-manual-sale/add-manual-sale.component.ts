import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import Shirt from '../../models/shirt';
import PaymentMethod from '../../models/paymentMethod';
import Customer from '../../models/customer';
import { SaleService } from '../../services/sales/sale.service';

@Component({
  selector: 'app-add-manual-sale',
  imports: [],
  templateUrl: './add-manual-sale.component.html',
  styleUrl: './add-manual-sale.component.css',
})
export class AddManualSaleComponent {
  public sale: Sale;
  public customers: Customer[] = [];
  public selectedShirts: Shirt[] = [];
  public shirts: Shirt[] = [];

  constructor(private router: Router, private salesService: SaleService) {
    this.sale = {
      items: [...this.selectedShirts],
      total: 0,
      type: 'MANUAL',
      status: 'DELIVERED',
      paymentMethod: {
        type: '',
        amount: 0,
      },
      additionalNotes: '',
      customer: {
        name: '',
        email: '',
        pastOrders: [],
        phone: '',
      },
    };
  }

  public back(): void {
    this.router.navigate(['/sales']);
  }

  public addSale(): void {}
}
