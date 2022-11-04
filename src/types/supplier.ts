import { TArea } from './area';

export type TSupplier = {
  id: number;
  name: string;
  imageUrl: string;
  contact: string;
  address: string;
  type: string;
  updatedDate: string;
  createdDate: string;
  active: number;
  areaId: number;
  area: TArea;
};
