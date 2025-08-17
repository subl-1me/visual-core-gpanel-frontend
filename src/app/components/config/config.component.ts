import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Admin from '../../models/admin';
import { ConfigService } from '../../services/config/config.service';
import { NgFor, NgIf } from '@angular/common';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-config',
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent implements OnInit {
  public adminList: Admin[] = [];
  public isLoadingAdminList: boolean = false;
  public displayedAdmins: Admin[] = [];

  constructor(private router: Router, private configService: ConfigService) {}

  ngOnInit(): void {
    this.getAdminList();
  }

  public navigateToAddADM(): void {
    this.router.navigate(['add-adm']);
  }

  private getAdminList(): void {
    this.isLoadingAdminList = true;
    this.configService.getAdminList().subscribe({
      next: (response) => {
        this.adminList = [...response.users].map((item) => {
          return {
            username: item.username,
            id: item.id,
            name: item.name,
            lastName: item.lastname,
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            email: item.email,
          };
        });
        this.displayedAdmins = [...this.adminList];

        this.isLoadingAdminList = false;
      },
      error: (err) => {
        this.isLoadingAdminList = false;
      },
    });
  }
}
