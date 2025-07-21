import { Component, OnInit } from '@angular/core';
import { TAB_NAMES } from '../../const';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  public session: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  public TAB_NAMES = TAB_NAMES;
  public toggleActiveTab(tabName: string): void {
    this.router.navigate([`${tabName}`]);
  }

  public logOut(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.session = this.authService.getLoginSession();
  }
}
