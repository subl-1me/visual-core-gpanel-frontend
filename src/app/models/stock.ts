export default interface Stock {
  _id?: string;
  sizes: Sizes[];
  availableColors: string[];
  details: ShortShirtDetails;
  status: string;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShortShirtDetails {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tier: 'SEASON' | 'DROP' | 'CUSTOM' | 'UNKNOWN' | '';
  media: Media[];
}

interface Media {
  public_id: string;
  url: string;
}

interface Sizes {
  size: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}
