import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Stock from '../../models/stock';

@Component({
  selector: 'app-stock',
  imports: [NgIf, NgFor],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent {
  constructor(private router: Router) {}
  public stock: Stock[] = [];
  public isLoading: boolean = false;

  public addShirt(): void {
    this.router.navigate(['add-shirt']);
  }
}
