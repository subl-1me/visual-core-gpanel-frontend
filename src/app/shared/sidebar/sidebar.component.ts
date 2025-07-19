import { Component } from '@angular/core';
import { TAB_NAMES } from '../../const';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private router: Router) {}

  public TAB_NAMES = TAB_NAMES;
  public toggleActiveTab(tabName: string): void {
    this.router.navigate([`${tabName}`]);
  }
}
