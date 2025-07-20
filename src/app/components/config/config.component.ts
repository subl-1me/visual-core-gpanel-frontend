import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent {
  constructor(private router: Router) {}

  public navigateToAddADM(): void {
    this.router.navigate(['add-adm']);
  }
}
