import { TLocation } from './location';

export type TArea = {
  id: number;
  name: string;
  shippingFee: number;
  description: string;
  createdDate: string;
  active: string;
  locations: TLocation[];
};
