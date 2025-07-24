import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import { SaleService } from '../../services/sales/sale.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [NgIf, NgFor],
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
        this.sales = [response.items];
        this.displayedSales = [response.items];
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
