import { TProduct } from 'types/product';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getProducts = (params?: any) => request.get('/admin/products', { params });

const productApi = {
  ...generateAPIWithPaging<TProduct>('admin/products'),
  getProducts,
};

export default productApi;
