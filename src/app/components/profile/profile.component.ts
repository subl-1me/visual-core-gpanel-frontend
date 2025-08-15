import { Component, OnInit } from '@angular/core';
import Admin from '../../models/admin';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AdminService } from '../../services/admin/admin.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  admin: Admin;
  updateMessage: string = '';
  isUpdating: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private adminService: AdminService
  ) {
    // Initialize admin with default values or fetch from a service
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    if (!session || !session.id) {
      alert('Session expired. Please log in again.');
      this.authService.logOut();
      this.router.navigate(['/login']);
    }

    this.admin = {
      id: session.id || 'null',
      email: session.email || 'null',
      username: session.username || 'null',
      name: session.name || 'null',
      lastName: session.lastName || 'null',
    };
  }

  ngOnInit() {}

  onSubmit() {
    this.isUpdating = true;
    this.adminService.updateAdmin(this.admin).subscribe({
      next: (response) => {
        let session = {
          id: this.admin.id,
          email: this.admin.email,
          username: this.admin.username,
          name: this.admin.name,
          lastName: this.admin.lastName,
        };
        this.authService.updateSession(session);
        this.updateMessage = 'Profile updated.';
        this.isUpdating = false;
      },
      error: (error) => {
        this.updateMessage = 'Error updating profile: ' + error.message;
        this.isUpdating = false;
      },
    });
  }
}
