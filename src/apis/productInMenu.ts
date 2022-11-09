import { TProductInMenu } from 'types/productInMenu';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';
import { BaseReponse } from 'types/response';

const getProductsInMenu = (menuId: number, params?: any) =>
  request.get(`/admin/menus/${menuId}/product-in-menus`, { params });

const create = (menuId: number, data: TProductInMenu) =>
  request.post<TProductInMenu>(`/admin/menus/${menuId}/product-in-menus`, { data });

const update = (menuId: number, data: TProductInMenu) =>
  request.put(`/admin/menus/${menuId}/product-in-menus`, { data });

const remove = (menuId: number, productId: number) =>
  request.delete(`/admin/menus/${menuId}/product-in-menus/${productId}`);

const productInMenuApi = {
  getProductsInMenu,
  create,
  update,
  remove,
};

export default productInMenuApi;
