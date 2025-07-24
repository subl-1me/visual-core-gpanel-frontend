import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TIER_NAMES } from '../../const';
import { NgFor, NgIf } from '@angular/common';
import Stock from '../../models/stock';
import { FormsModule, Form } from '@angular/forms';
import { StockService } from '../../services/stock/stock.service';

@Component({
  selector: 'app-add-shirt',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './add-shirt-stock.component.html',
  styleUrl: './add-shirt-stock.component.css',
})
export class AddShirtStockComponent {
  public tiers: any = TIER_NAMES;
  public availableColors: string[] = [];
  public stock: Stock;
  public selectedColor: string = '#fff';
  public lastSelectedColor: string;
  public creationStatusMessage: string = '';

  constructor(private router: Router, private stockService: StockService) {
    this.lastSelectedColor = this.selectedColor;
    this.stock = {
      status: 'Available',
      sizes: [
        { size: 'L', quantity: 0 },
        { size: 'M', quantity: 0 },
        { size: 'L', quantity: 0 },
        { size: 'XL', quantity: 0 },
      ],
      details: {
        name: '',
        description: '',
        imageUrl: '',
        price: 0,
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

  public createStock(_form: Form): void {
    this.creationStatusMessage = 'Saving stock...';
    this.stock.availableColors = [...this.availableColors];

    // calculate total
    const stockSum = this.stock.sizes.reduce((accum, current) => {
      return (accum += current.quantity);
    }, 0);

    this.stock.total = stockSum;
    this.stockService.add(this.stock).subscribe((response) => {
      console.log(response);
    });
  }

  public addSelectedColorList(color: string, event?: any) {
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

  private changeColorPickerView(): void {
    const colorPicker = document.getElementById('color-preview');
    if (!colorPicker) {
      return;
    }

    colorPicker.style.backgroundColor = this.lastSelectedColor;
  }
}
