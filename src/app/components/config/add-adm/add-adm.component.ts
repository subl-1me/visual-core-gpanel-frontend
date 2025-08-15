import { Component } from '@angular/core';
import Admin from '../../../models/admin';
import { Form, FormsModule } from '@angular/forms';
import { AddAdmService } from '../../../services/add-adm/add-adm.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-adm',
  imports: [FormsModule, NgIf],
  standalone: true,
  templateUrl: './add-adm.component.html',
  styleUrl: './add-adm.component.css',
})
export class AddAdmComponent {
  public adm: Admin;
  public passConfirmation: string;
  public isLoading: boolean;
  public statusMessage: string;

  constructor(private admService: AddAdmService, private router: Router) {
    this.adm = {
      id: '',
      username: '',
      email: '',
      password: '',
      name: '',
      lastName: '',
    };
    this.passConfirmation = '';
    this.isLoading = false;
    this.statusMessage = '';
  }

  public onSubmit(_form: any): void {
    this.isLoading = true;
    this.admService.addNewAdm(this.adm).subscribe({
      next: (response) => {
        console.log(response);
        this.statusMessage = 'Admin added successfully.';
        this.isLoading = false;
        this.resetForm();
      },
      error: (err) => {
        this.statusMessage = err.message;
        this.isLoading = false;
      },
    });
  }

  public back(): void {
    this.router.navigate(['/config']);
  }

  private resetForm(): void {
    this.adm = {
      id: '',
      username: '',
      email: '',
      name: '',
      lastName: '',
      password: '',
    };
    this.passConfirmation = '';
  }
}
