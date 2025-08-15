import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import { SaleService } from '../../services/sales/sale.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  AUTOMATIC_SALE_TYPE,
  MANUAL_SALE_TYPE,
  ALL_TYPE_FILTER,
  PAYMENT_TYPES,
} from '../../const';

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

  public filters = {
    ALL: ALL_TYPE_FILTER,
    MANUAL: MANUAL_SALE_TYPE,
    AUTOMATIC: AUTOMATIC_SALE_TYPE,
  };
  public paymentFilters = PAYMENT_TYPES;

  public selectedTypeFilter = signal('All');
  public selectedPymntFilter = signal('All');
  public selectedToDate = signal('mm/dd/yyyy');
  public selectedFromDate = signal('mm/dd/yyyy');

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

  private onAllSelected(): void {
    this.displayedSales = [...this.sales];
  }

  onSelectedPymntFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    this.selectedPymntFilter.set(value);
  }

  onSelectedTypeFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    this.selectedTypeFilter.set(value);
  }

  // public onApplyFilters(): void {
  //   this.applyPaymentFilter();
  //   this.applyTypeFilter();
  //   // this.applyDateFilter();
  // }

  private applyPaymentFilter(): void {
    const filter = this.selectedPymntFilter();

    if (filter === this.filters.ALL) {
      this.displayedSales = [...this.sales];
      return;
    }

    this.displayedSales = this.sales.filter(
      (sale) => sale.paymentMethod === this.selectedPymntFilter()
    );
  }

  private applyTypeFilter(): void {
    const filter = this.selectedTypeFilter();

    if (filter === this.filters.ALL) {
      this.displayedSales = [...this.sales];
      return;
    }

    this.displayedSales = this.sales.filter(
      (sale) => sale.type === this.selectedTypeFilter()
    );
  }

  public onSelectedToDate(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    this.selectedToDate.set(value);
  }

  public onSelectedFromDate(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    this.selectedFromDate.set(value);
  }

  private applyDateFilter(): void {
    const startDate = new Date(this.selectedToDate());
    const endDate = new Date(this.selectedFromDate());

    endDate.setHours(23, 59, 59, 999);
    this.displayedSales = this.sales.filter((sale) => {
      if (!sale.created_at) return false;

      const saleDate = new Date(sale.created_at);
      console.log(startDate);
      console.log(endDate);
      console.log(saleDate);

      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  public onApplyFilters(): void {
    this.displayedSales = this.sales.filter((sale) => {
      const matchesPayment =
        this.selectedPymntFilter() === this.filters.ALL ||
        sale.paymentMethod === this.selectedPymntFilter();

      const matchesType =
        this.selectedTypeFilter() === this.filters.ALL ||
        sale.type === this.selectedTypeFilter();

      // const matchesDate = this.checkDateFilter(sale.created_at || new Date());

      return matchesPayment && matchesType;
    });
  }

  private checkDateFilter(saleDate: string | Date): boolean {
    if (
      this.selectedFromDate() === 'mm/dd/yyyy' ||
      this.selectedToDate() === 'mm/dd/yyyy'
    )
      return true;

    const startDate = new Date(this.selectedFromDate());
    const endDate = new Date(this.selectedToDate());
    endDate.setHours(23, 59, 59, 999);

    const date = new Date(saleDate);
    return date >= startDate && date <= endDate;
  }
}
