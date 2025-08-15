import { Component } from '@angular/core';
import { Form, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Customer from '../../../models/customer';
import { NgIf } from '@angular/common';
import { CustomerService } from '../../../services/customers/customer.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css',
})
export class AddCustomerComponent {
  public addCustomerResponse: string;
  public isLoading: boolean;
  public customer: Customer;
  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customer = {
      _id: '',
      name: '',
      address: '',
      email: '',
      pastOrders: [],
      phone: '',
    };
    this.addCustomerResponse = '';
    this.isLoading = false;
  }

  public return(): void {
    this.router.navigate(['/add-manual-sale']);
  }

  public onSubmit(form: any): void {
    this.isLoading = true;
    this.customerService.addCustomer(this.customer).subscribe({
      next: (response) => {
        this.customer = {
          _id: '',
          name: '',
          address: '',
          email: '',
          pastOrders: [],
          phone: '',
        };

        form.reset();
        this.addCustomerResponse = 'Customer created successfully.';
        this.isLoading = false;
      },
      error: (err) => {
        const { error } = err;
        this.addCustomerResponse = error.message;
        this.isLoading = false;
      },
    });
  }
}
