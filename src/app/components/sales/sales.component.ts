import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import { SaleService } from '../../services/sales/sale.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [NgIf, NgFor, DatePipe, DecimalPipe],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  private sales: Sale[] = [];
  public displayedSales: Sale[] = [];
  public responseStatusMessage = '';

  constructor(private router: Router, private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  public navigateToAddSale(): void {
    this.router.navigate(['add-manual-sale']);
  }

  private loadSales(): void {
    this.saleService.getSalesList().subscribe({
      next: (response) => {
        this.displayedSales = response.items.map((item: any) => {
          return {
            no: item.no,
            id: item.id,
            items: JSON.parse(item.items),
            total: item.total,
            type: item.type,
            status: item.status,
            paymentMethod: item.paymentMethod,
            additionalNotes: item.additionalNotes,
            customer: JSON.parse(item.customer),
            created_at: item.created_at,
            updated_at: item.updated_at,
          };
        });
        this.sales = [...this.displayedSales];

        console.log(this.displayedSales);
      },
      error: (err) => {
        const { error } = err;
        this.responseStatusMessage = `Error trying to load sales due the following error: ${
          error.message || error
        }`;
      },
    });
  }
}
