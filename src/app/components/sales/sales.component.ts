import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  constructor(private router: Router) {}

  public navigateToAddSale(): void {
    this.router.navigate(['add-manual-sale']);
  }
}
