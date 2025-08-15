import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import { SaleService } from '../../services/sales/sale.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { AUTOMATIC_SALE_TYPE, MANUAL_SALE_TYPE } from '../../const';

@Component({
  selector: 'app-sales',
  imports: [NgIf, NgFor, DatePipe, DecimalPipe],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  public sales: Sale[] = [];
  public displayedSales: Sale[] = [];
  public responseStatusMessage = '';
  public totalManualSales = 0;
  public totalAutomaticSales = 0;
  public isLoadingSales = false;

  constructor(private router: Router, private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  public navigateToAddSale(): void {
    this.router.navigate(['add-manual-sale']);
  }

  private loadSales(): void {
    this.isLoadingSales = true;
    this.saleService.getSalesList().subscribe({
      next: (response) => {
        this.displayedSales = response.items.map((item: any) => {
          return {
            no: item.no,
            id: item.id,
            items: item.items,
            total: item.total,
            type: item.type,
            status: item.status,
            paymentMethod: item.paymentMethod,
            additionalNotes: item.additionalNotes,
            customer: item.customer,
            created_at: item.createdAt,
            updated_at: item.updatedAt,
          } as Sale;
        });
        this.sales = [...this.displayedSales];

        this.totalManualSales = this.sales.filter(
          (sale) => sale.type === MANUAL_SALE_TYPE
        ).length;
        this.totalAutomaticSales = this.sales.filter(
          (sale) => sale.type === AUTOMATIC_SALE_TYPE
        ).length;
        this.isLoadingSales = false;
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
