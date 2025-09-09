import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private routed: ActivatedRoute
  ) {}

  public isAuth: boolean = false;

  title = 'visual-core';

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((auth) => {
      this.isAuth = auth;
    });
  }

  ngDoCheck(): void {
    const currentRoute =
      this.routed.snapshot.root.firstChild?.routeConfig?.path;
    console.log(currentRoute);
    if (currentRoute?.includes('shirt-visualization')) {
      this.isAuth = false;
    }
  }
}
