import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Stock from '../../models/stock';
import { StockService } from '../../services/stock/stock.service';
import { TIER_NAMES } from '../../const';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  constructor(private router: Router, private stockService: StockService) {}

  public TIERS = TIER_NAMES;
  public stocks: Stock[] = [];
  public displayedStocks: Stock[] = [];
  public isLoading: boolean = false;
  public totalStocks: number = 0;
  public searchTerm: string = '';
  public tierFilter: string = 'Select tier';
  public statusFilter: string = '';
  public responseStatusMessage: string = '';

  public addShirt(): void {
    this.router.navigate(['add-shirt']);
  }

  ngOnInit(): void {
    this.loadStocks();
  }

  private loadStocks(): void {
    this.stockService.getStocks().subscribe((response) => {
      const { items } = response;
      const parsedItems = items.map((item: any) => {
        return {
          ...item,
          availableColors: item.availableColors,
          details: item.details,
          sizes: item.sizes,
        };
      });
      this.stocks = [...parsedItems];
      this.displayedStocks = [...parsedItems];
      this.totalStocks = this.stocks.reduce((accum, current) => {
        return (accum += current.total);
      }, 0);
    });
  }

  public search(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.displayedStocks = [...this.stocks];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.displayedStocks = this.displayedStocks.filter((stock) =>
      stock.details.name.toLocaleLowerCase().includes(searchTermLower)
    );
  }

  public filterByTier(): void {
    if (this.tierFilter === 'Select tier') {
      this.displayedStocks = [...this.stocks];
      this.tierFilter = '';
    } else {
      this.displayedStocks = this.stocks.filter(
        (stock) => stock.details.tier === this.tierFilter
      );
    }
  }

  public filterByStatus(): void {
    if (this.statusFilter === 'All Status') {
      this.displayedStocks = [...this.stocks];
      this.statusFilter = '';
    } else {
      this.displayedStocks = this.stocks.filter(
        (stock) => stock.status === this.statusFilter
      );
    }
  }

  // stock management
  public showStockDeletionButtons(stockId: string): void {
    if (stockId === '' || !stockId) {
      alert('Stock ID undefined');
      return;
    }

    const stockDeletion = document.getElementById(`stock-deletion-${stockId}`);
    if (!stockDeletion) {
      return; //never
    }
    const stockManagement = document.getElementById(
      `stock-management-${stockId}`
    );
    if (!stockManagement) {
      return; // never
    }

    stockDeletion.classList.remove('hidden');
    stockManagement.classList.add('hidden');
  }

  public cancelStockDeletion(stockId: string): void {
    if (stockId === '' || !stockId) {
      alert('Stock ID undefined');
      return;
    }
    const stockManagement = document.getElementById(
      `stock-management-${stockId}`
    );
    const stockDeletion = document.getElementById(`stock-deletion-${stockId}`);
    if (!stockDeletion || !stockManagement) {
      alert('Stock ID undefined');
      return;
    }

    stockDeletion.classList.add('hidden');
    stockManagement.classList.remove('hidden');
  }

  public confirmStockDeletion(stockId: string): void {
    const processingStock = document.getElementById(
      `processing-stock-${stockId}`
    );
    if (!processingStock) {
      alert('Stock ID undefined');
      return;
    }
    const stockManagement = document.getElementById(
      `stock-management-${stockId}`
    );
    if (!stockManagement) {
      return; // never
    }
    const stockDeletion = document.getElementById(`stock-deletion-${stockId}`);
    if (!stockDeletion) {
      return; //never
    }

    processingStock.classList.remove('hidden');
    stockManagement.classList.add('hidden');
    stockDeletion.classList.add('hidden');

    this.stockService.delete(stockId).subscribe({
      next: (_response) => {
        this.stocks = this.stocks.filter((stock) => stock.id !== stockId);
        this.displayedStocks = [...this.stocks];
        this.isLoading = false;
        this.responseStatusMessage = '';
      },
      error: (err) => {
        const { error } = err;
        this.responseStatusMessage = `Error trying to remove stock item: ${error.message}`;
        this.isLoading = false;
        const stockDeletion = document.getElementById(
          `processing-stock-${stockId}`
        );
        if (!stockDeletion) {
          return; //never
        }

        stockDeletion.classList.add('hidden');
        stockManagement.classList.remove('hidden');
      },
    });
  }

  public openStockModal(stockId: string) {
    const modal = document.getElementById(`stock-modal-${stockId}`);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  public closeStockModal(stockId: string) {
    const modal = document.getElementById(`stock-modal-${stockId}`);
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}
