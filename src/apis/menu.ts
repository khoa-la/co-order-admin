import { TMenu } from 'types/menu';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getMenus = (params?: any) => request.get('/admin/menus', { params });

const menuApi = {
  ...generateAPIWithPaging<TMenu>('admin/menus'),
  getMenus,
};

export default menuApi;
