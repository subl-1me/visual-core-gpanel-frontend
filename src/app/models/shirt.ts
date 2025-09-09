export default interface Shirt {
  _id: string;
  name: string;
  description: string;
  identificator: string;
  tier: 'SEASON' | 'DROP' | 'CUSTOM' | 'UNKNOWN' | '';
  media: Media[];
  color: string;
  price: number;
  updatedAt?: Date;
  createdAt?: Date;
}

interface Media {
  url: string;
  public_id: string;
}
