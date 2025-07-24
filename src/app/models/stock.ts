export default interface Stock {
  id?: string;
  sizes: Sizes[];
  availableColors: string[];
  details: ShortShirtDetails;
  status: string;
  total: number;
}

interface ShortShirtDetails {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tier: 'SEASON' | 'DROP' | 'CUSTOM' | 'UNKNOWN' | '';
  media: string[];
}

interface Sizes {
  size: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}
