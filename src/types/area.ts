export type TArea = {
  id: number;
  name: string;
  shippingFee: number;
  description: string;
  createdDate: string;
  active: boolean;
  locations: TLocation[];
};

export type TLocation = {
  id: number;
  name: string;
  address: string;
  createdDate: string;
  active: boolean;
  areaId: number;
};
