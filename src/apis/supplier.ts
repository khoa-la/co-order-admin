import { TSupplier } from 'types/supplier';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getSuppliers = (params?: any) => request.get('/admin/suppliers', { params });
const updateSupplier = (data?: any) => request.put('/admin/suppliers', { data });

const supplierApi = {
  ...generateAPIWithPaging<TSupplier>('admin/suppliers'),
  getSuppliers,
  updateSupplier,
};

export default supplierApi;
