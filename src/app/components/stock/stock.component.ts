import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Stock from '../../models/stock';
import { StockService } from '../../services/stock/stock.service';
import { TIER_NAMES } from '../../const';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock',
  imports: [NgIf, NgFor, FormsModule, DatePipe],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent implements OnInit {
  constructor(private router: Router, private stockService: StockService) {}

  public TIERS = TIER_NAMES;
  public stocks: Stock[] = [];
  public displayedStocks: Stock[] = [];
  public isLoading: boolean = false;
  public isLoadingStock: boolean = false;
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
    this.isLoadingStock = true;
    this.stockService.getStocks().subscribe({
      next: (res) => {
        const { response } = res;
        const parsedItems = response.map((item: any) => {
          return {
            ...item,
            availableColors: item.availableColors,
            details: item.details,
            sizes: item.sizes,
            id: item._id,
          };
        });
        this.stocks = [...parsedItems];
        this.displayedStocks = [...parsedItems];
        this.totalStocks = this.stocks.reduce((accum, current) => {
          return (accum += current.total);
        }, 0);
        this.isLoadingStock = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
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

  public navigateToEditStock(stockId: string): void {
    if (!stockId) {
      alert('Product not found.');
      return;
    }

    this.router.navigate([`/stock/${stockId}`]);
  }
}
