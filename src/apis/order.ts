import { TOrder } from 'types/order';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getOrders = (params?: any) => request.get('/admin/orders', { params });

const orderApi = {
  ...generateAPIWithPaging<TOrder>('admin/orders'),
  getOrders,
};

export default orderApi;
