import { TCategory } from './category';

export type TProduct = {
  id: number;
  code: string;
  name: string;
  imageUrl: string;
  type: string;
  updatedDate: string;
  createdDate: string;
  active: number;
  categoryId: number;
  category: TCategory;
  supplierId: number;
};
