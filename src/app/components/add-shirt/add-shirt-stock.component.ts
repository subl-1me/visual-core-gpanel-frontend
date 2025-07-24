import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TIER_NAMES } from '../../const';
import { NgFor, NgIf } from '@angular/common';
import Stock from '../../models/stock';
import { FormsModule, Form, NgForm } from '@angular/forms';
import { StockService } from '../../services/stock/stock.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-shirt',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './add-shirt-stock.component.html',
  styleUrl: './add-shirt-stock.component.css',
})
export class AddShirtStockComponent {
  @ViewChild('createStockForm') form!: NgForm;

  public tiers: any = TIER_NAMES;
  public availableColors: string[] = [];
  public stock: Stock;
  public selectedColor: string = '#fff';
  public lastSelectedColor: string;
  public creationStatusMessage: string = '';
  public isLoading: boolean = false;
  public responseMessage: string = '';

  constructor(private router: Router, private stockService: StockService) {
    this.lastSelectedColor = this.selectedColor;
    this.stock = {
      status: 'Available',
      sizes: [
        { size: 'S', quantity: 0 },
        { size: 'M', quantity: 0 },
        { size: 'L', quantity: 0 },
        { size: 'XL', quantity: 0 },
      ],
      details: {
        name: '',
        description: '',
        imageUrl: '',
        price: 100,
        tier: '',
        media: [],
      },
      availableColors: [],
      total: 0,
    };
  }

  public back(): void {
    this.router.navigate(['/stock']);
  }

  public check(): void {
    if (this.stock.details.price < 100) {
      this.stock.details.price = 100;
    }
  }

  public checkStockValue(stockType: string): void {
    switch (stockType) {
      case 'S':
        if (this.stock.sizes[0].quantity < 0) {
          this.stock.sizes[0].quantity = 0;
        }
        break;
      case 'M':
        if (this.stock.sizes[1].quantity < 0) {
          this.stock.sizes[1].quantity = 0;
        }
        break;
      case 'L':
        if (this.stock.sizes[2].quantity < 0) {
          this.stock.sizes[2].quantity = 0;
        }
        break;
      case 'XL':
        if (this.stock.sizes[3].quantity < 0) {
          this.stock.sizes[3].quantity = 0;
        }
        break;
    }
  }

  public createStock(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;
    this.stock.availableColors = [...this.availableColors];

    // calculate total
    const stockSum = this.stock.sizes.reduce((accum, current) => {
      return (accum += current.quantity);
    }, 0);

    this.stock.total = stockSum;
    this.stockService.add(this.stock).subscribe({
      next: (_response) => {
        this.isLoading = false;
        this.responseMessage = '';
        this.router.navigate(['/stock']);
      },
      error: (err) => {
        const { error } = err;
        this.responseMessage = `Error trying to add new stock: ${error.message}`;
        this.isLoading = false;
      },
    });
  }

  public addSelectedColorList(color: string, event?: any) {
    if (this.availableColors.includes(color)) {
      return;
    }
    if (event) {
      const colorPickerInput = document.getElementById(
        'color-selector'
      ) as HTMLInputElement;
      if (colorPickerInput) {
        this.availableColors.push(colorPickerInput.value);
        this.lastSelectedColor = this.selectedColor;
        this.changeColorPickerView();
      }
    } else {
      this.availableColors.push(color);
      this.lastSelectedColor = this.selectedColor;
      this.changeColorPickerView();
    }

    return;
  }

  public removeColor(hex: string): void {
    this.availableColors = this.availableColors.filter(
      (color) => color !== hex
    );
  }

  private changeColorPickerView(): void {
    const colorPicker = document.getElementById('color-preview');
    if (!colorPicker) {
      return;
    }

    colorPicker.style.backgroundColor = this.lastSelectedColor;
  }
}
