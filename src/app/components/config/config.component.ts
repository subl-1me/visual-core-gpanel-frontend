import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Admin from '../../models/admin';
import { ConfigService } from '../../services/config/config.service';
import { NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-config',
  imports: [NgFor, DatePipe],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css',
})
export class ConfigComponent implements OnInit {
  public adminList: Admin[] = [];
  public isLoadingAdminList: boolean = false;

  constructor(private router: Router, private configService: ConfigService) {}

  ngOnInit(): void {
    this.getAdminList();
  }

  public navigateToAddADM(): void {
    this.router.navigate(['add-adm']);
  }

  private getAdminList(): void {
    this.isLoadingAdminList = true;
    this.configService.getAdminList().subscribe((response) => {
      console.log(response);
      this.adminList = [...response.items].map((item) => {
        return {
          username: item.username,
          id: item.id,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
          email: item.email,
        };
      });
    });
  }
}
