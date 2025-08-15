import { Component } from '@angular/core';
import Admin from '../../../models/admin';
import { Form, FormsModule } from '@angular/forms';
import { AddAdmService } from '../../../services/add-adm/add-adm.service';
import { NgIf } from '@angular/common';
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

  constructor(private admService: AddAdmService) {
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

  public onSubmit(_form: Form): void {
    this.isLoading = true;
    this.admService.addNewAdm(this.adm).subscribe((response) => {
      console.log(response);
      this.statusMessage = 'New user created successfully.';
      this.isLoading = false;
      this.resetForm();
    });
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
