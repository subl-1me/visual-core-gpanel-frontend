import Customer from './customer';

export default interface Sale {
  no?: number;
  _id?: string;
  items: any;
  total: number;
  type: 'AUTOMATIC' | 'MANUAL';
  status: 'REQUESTED' | 'DELIVERED' | 'ERROR' | 'IN PROCESS';
  paymentMethod: string;
  additionalNotes: string;
  customer: Customer;
  created_at?: Date;
  updated_at?: Date;
}
