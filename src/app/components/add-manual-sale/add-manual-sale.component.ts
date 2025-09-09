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
import { TIER_NAMES } from '../../const';

@Component({
  selector: 'app-add-manual-sale',
  imports: [NgFor, FormsModule, NgIf, DatePipe, DecimalPipe],
  templateUrl: './add-manual-sale.component.html',
  styleUrl: './add-manual-sale.component.css',
})
export class AddManualSaleComponent implements OnInit {
  @ViewChild('createSaleForm') form!: NgForm;

  public tiers = TIER_NAMES;
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
      next: (res) => {
        const { response } = res;
        const parsedItems = response.map((item: any) => {
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
      next: (res) => {
        const { response } = res;
        this.displayedCustomers = response.map((item: any) => {
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
    if (this.selectedProductStock.details.tier === TIER_NAMES.DROP) {
      this.selectedSize = event;
      return;
    }

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

  public updateDisplayStock(id: string): void {}

  public onQuantityChange(event: string): void {
    let inputQty = document.getElementById('inputQuantity') as HTMLInputElement;

    if (!inputQty) return;

    if (Number(event) <= 0) {
      // when string
      inputQty.value = '';
      this.selectedQuantity = '';
      return;
    }

    let remaining =
      this.selectedProductStock.total -
      this.getTotalStockAdded(this.selectedProductStock);
    this.selectedQuantity =
      Number(event) > remaining ? String(remaining) : event;
    if (this.selectedProductStock.details.tier === TIER_NAMES.DROP) {
      inputQty.value = Number(event) > remaining ? String(remaining) : event;
      return;
    }

    // custom case
    inputQty.value = Number(event) > remaining ? String(remaining) : event;
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

  public hasStockInProcess(stock: Stock): boolean {
    if (this.productsToBeProcessed.length === 0 || !stock) return false;
    return this.productsToBeProcessed.some(
      (p: any) => p.details?.name === stock.details?.name
    );
  }

  public getTotalStockAdded(stock: Stock): number {
    if (this.productsToBeProcessed.length === 0 || !stock) return 0;

    const totalInProcess = this.productsToBeProcessed.reduce(
      (accum: number, current: any) => {
        if (current.details?.name === stock.details?.name) {
          return (accum += current.quantity);
        }
        return accum;
      },
      0
    );
    return totalInProcess;
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

    this.restoreStock(product);
  }

  public restoreStock(product: any): void {
    this.selectedProductStock = this.displayedStock.find(
      (stock) => stock.details.name === product.details.name
    );

    this.calculateTotal();
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
