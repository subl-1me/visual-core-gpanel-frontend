export default interface PaymentMethod {
  id?: string;
  type: 'CASH' | 'CARD' | 'TRANSFER' | '';
  amount: number;
}
