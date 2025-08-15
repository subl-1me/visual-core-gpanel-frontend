import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Sale from '../../models/sale';
import Shirt from '../../models/shirt';
import Customer from '../../models/customer';
import { SaleService } from '../../services/sales/sale.service';
import { CustomerService } from '../../services/customers/customer.service';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { StockService } from '../../services/stock/stock.service';
import Stock from '../../models/stock';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-manual-sale',
  imports: [NgFor, FormsModule, NgIf, DatePipe, DecimalPipe],
  templateUrl: './add-manual-sale.component.html',
  styleUrl: './add-manual-sale.component.css',
})
export class AddManualSaleComponent implements OnInit {
  @ViewChild('createSaleForm') form!: NgForm;

  public sale: Sale;
  public selectedShirts: Shirt[] = [];
  public displayedStock: Stock[] = [];
  public shirts: Shirt[] = [];
  public displayedCustomers: Customer[];

  public selectedProductStock: Stock | any = null;
  public selectedSize: any;
  public selectedQuantity: string | number = '';
  public selectedCustomer: Customer | any = null;
  public selectedPaymentMethod: string = '';
  public toastMessages: string = '';
  public isloading: boolean = false;

  public productsToBeProcessed: any = [];

  public subTotal: number = 0;
  public total: number = 0;

  constructor(
    private router: Router,
    private salesService: SaleService,
    private customerService: CustomerService,
    private stockService: StockService
  ) {
    this.sale = {
      items: [...this.selectedShirts],
      total: 0,
      type: 'MANUAL',
      status: 'DELIVERED',
      paymentMethod: '',
      additionalNotes: '',
      customer: {
        _id: '',
        name: '',
        email: '',
        pastOrders: [],
        phone: '',
        address: '',
      },
    };
    this.displayedCustomers = [];
  }

  ngOnInit(): void {
    this.loadCustomerList();
    this.loadStock();
  }

  public back(): void {
    this.router.navigate(['/sales']);
  }

  private loadStock(): void {
    this.stockService.getStocks().subscribe({
      next: (response) => {
        const { items } = response;
        const parsedItems = items.map((item: any) => {
          return {
            ...item,
            availableColors: item.availableColors,
            details: item.details,
            sizes: item.sizes,
          };
        });
        this.displayedStock = [...parsedItems];
      },
      error: (err) => {},
    });
  }

  private loadCustomerList(): void {
    this.customerService.getCustomerList().subscribe({
      next: (response) => {
        this.displayedCustomers = response.items.map((item: any) => {
          return {
            _id: item._id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address,
            level: item.level,
            pastOrders: item.pastOrders,
            created_at: item.createdAt,
            updated_at: item.updatedAt,
          } as Customer;
        });

        console.log(this.displayedCustomers);
      },
      error: (err) => {},
    });
  }

  public navigateToCreateCustomer(): void {
    this.router.navigate(['/add-customer']);
  }

  public onProductChange(selectedProductStock: Stock): void {
    this.selectedProductStock = selectedProductStock;
    this.selectedQuantity = '';
    this.selectedSize = null;
  }

  public onSizeChange(event: any): void {
    if (event.quantity === 0) {
      return;
    }

    this.selectedSize = event;
  }

  public togglePaymentMethod(method: string) {
    this.selectedPaymentMethod = method.toLocaleUpperCase();
  }

  public toggleAddProduct(): void {
    this.productsToBeProcessed.push({
      tempId: uuid.v7(),
      details: this.selectedProductStock.details,
      size: this.selectedSize,
      quantity: this.selectedQuantity,
    });

    this.selectedProductStock = null;
    this.selectedQuantity = '';
    this.selectedSize = null;

    // re-calculate
    this.calculateTotal();
  }

  public onQuantityChange(event: string): void {
    if (Number(event) <= 0) {
      // when string
      const inputQty = document.getElementById(
        'inputQuantity'
      ) as HTMLInputElement;
      inputQty.value = '';
      this.selectedQuantity = '';
      return;
    }

    if (event > this.selectedSize.quantity) {
      const inputQty = document.getElementById(
        'inputQuantity'
      ) as HTMLInputElement;
      inputQty.value = this.selectedSize.quantity;
      this.selectedQuantity = this.selectedSize.quantity;
      return;
    }

    this.selectedQuantity = event;
  }

  public onCustomerChange(customer: any): void {
    if (typeof customer === 'string') {
      this.resetSelectedCustomer();
      return;
    }
    this.selectedCustomer = customer;
  }

  private resetSelectedCustomer(): void {
    this.selectedCustomer = {
      name: '',
      email: '',
      phone: '',
      address: '',
    };
  }

  private resetSelectedProduct(): void {
    this.selectedProductStock = {
      sizes: [],
      availableColors: [],
      status: 'AVAILABLE', // DEFAULT
      total: 0,
      details: {
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        tier: '',
        media: [],
      },
    };
  }

  public canAddProduct(): boolean {
    return this.productsToBeProcessed;
  }

  private calculateTotal(): void {
    const total = this.productsToBeProcessed.reduce(
      (accum: number, current: any) => {
        return (accum += current.details.price * current.quantity);
      },
      0
    );

    this.total = total;
  }

  public removeProduct(product: any): void {
    this.productsToBeProcessed = this.productsToBeProcessed.filter(
      (p: any) => p.tempId !== product.tempId
    );
  }

  public completeSale(): void {
    if (
      this.productsToBeProcessed.length === 0 ||
      !this.selectedCustomer ||
      this.selectedPaymentMethod === ''
    ) {
      this.toastMessages = 'Please, complete all the sections.';
      return;
    }

    this.isloading = true;
    this.sale.customer = this.selectedCustomer;
    this.sale.items = [...this.productsToBeProcessed];
    this.sale.paymentMethod = this.selectedPaymentMethod;
    this.sale.status = 'IN PROCESS';
    this.sale.type = 'MANUAL';
    this.sale.total = this.total;

    // send sale
    this.salesService.addSale(this.sale).subscribe({
      next: (response) => {
        this.toastMessages = 'Sale added successfully.';
        this.isloading = false;
        this.resetFields();
      },
      error: (err) => {
        this.toastMessages = `Something went wrong adding sale due: ${err.error.message}`;
        this.isloading = false;
      },
    });
  }

  private resetFields(): void {
    this.selectedProductStock = null;
    this.selectedQuantity = '';
    this.selectedShirts = [];
    this.selectedSize = null;
    this.selectedCustomer = null;
    this.selectedPaymentMethod = '';
    this.productsToBeProcessed = [];
    this.total = 0;
    this.subTotal = 0;

    this.sale = {
      items: [],
      total: 0,
      type: 'MANUAL',
      status: 'DELIVERED',
      paymentMethod: '',
      additionalNotes: '',
      customer: {
        _id: '',
        name: '',
        email: '',
        pastOrders: [],
        phone: '',
        address: '',
      },
    };
  }
}
