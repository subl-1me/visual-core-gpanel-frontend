import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  imports: [],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css',
})
export class StockComponent {
  constructor(private router: Router) {}

  public addShirt(): void {
    this.router.navigate(['add-shirt']);
  }
}
