export default interface Stock {
  id: string;
  shirt_id: string;
  size: 'S' | 'M' | 'L' | 'XL';
  color: string;
  quantity: number;
}
