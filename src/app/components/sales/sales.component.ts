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

  public isConfirmingDeletion: boolean = false;

  public deletingMessage: string = '';

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
            _id: item._id,
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

  public confirmSaleDeletion(saleId: string): void {
    const saleElement = document.getElementById(`sale-deletion-${saleId}`);
    if (!saleElement) {
      this.responseStatusMessage =
        'There was an error trying to delete sale. Try again.';
      return;
    }

    const saleManagement = document.getElementById(`sale-management-${saleId}`);
    if (!saleManagement) {
      this.responseStatusMessage =
        'There was a error performin that operation. Try again.';
      return;
    }

    saleElement.classList.remove('hidden');
    saleManagement.classList.add('hidden');
  }

  public cancelConfirmation(saleId: string): void {
    const saleElement = document.getElementById(`sale-deletion-${saleId}`);
    if (!saleElement) {
      this.responseStatusMessage =
        'There was an error trying to delete sale. Try again.';
      return;
    }

    const saleManagement = document.getElementById(`sale-management-${saleId}`);
    if (!saleManagement) {
      this.responseStatusMessage =
        'There was a error performin that operation. Try again.';
      return;
    }

    saleElement.classList.add('hidden');
    saleManagement.classList.remove('hidden');
  }

  public onDeleteSale(saleId: string): void {
    const processingDeletion = document.getElementById(
      `processing-sale-${saleId}`
    );
    if (!processingDeletion) {
      this.responseStatusMessage =
        'There was an error trying to delete sale. Try again.';
      return;
    }

    const saleElement = document.getElementById(`sale-deletion-${saleId}`);
    if (!saleElement) {
      this.responseStatusMessage =
        'There was an error trying to delete sale. Try again.';
      return;
    }

    processingDeletion.classList.remove('hidden');
    saleElement.classList.add('hidden');

    this.saleService.removeSale(saleId).subscribe({
      next: (response) => {
        this.responseStatusMessage = 'Sale deleted';
        processingDeletion.classList.add('hidden');

        const saleManagement = document.getElementById(
          `sale-management-${saleId}`
        );
        if (!saleManagement) {
          this.responseStatusMessage =
            'There was a error performin that operation. Try again.';
          return;
        }

        this.sales = this.sales.filter((sale) => sale._id !== saleId);
        this.displayedSales = [...this.sales];

        saleElement.classList.remove('hidden');
      },
      error: (err) => {
        this.responseStatusMessage = err.message;
      },
    });
  }
}
