import Customer from './customer';
import PaymentMethod from './paymentMethod';
import Shirt from './shirt';

export default interface Sale {
  id?: string;
  items: Shirt[];
  total: number;
  type: 'AUTOMATIC' | 'MANUAL';
  status: 'REQUESTED' | 'DELIVERED' | 'ERROR' | 'IN PROCESS';
  paymentMethod: PaymentMethod;
  additionalNotes: string;
  customer: Customer;
  created_at?: Date;
  updated_at?: Date;
}
