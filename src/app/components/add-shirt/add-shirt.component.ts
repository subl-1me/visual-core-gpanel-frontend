import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-shirt',
  imports: [],
  templateUrl: './add-shirt.component.html',
  styleUrl: './add-shirt.component.css',
})
export class AddShirtComponent {
  constructor(private router: Router) {}

  public back(): void {
    this.router.navigate(['/stock']);
  }
}
