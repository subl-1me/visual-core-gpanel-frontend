import Sale from './sale';

export default interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  level?: number;
  pastOrders: Sale[];
  created_at?: Date;
  updated_at?: Date;
}
