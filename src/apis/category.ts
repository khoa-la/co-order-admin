import { TCategory } from 'types/category';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getCategories = (params?: any) => request.get('/admin/categories', { params });

const categoryApi = {
  ...generateAPIWithPaging<TCategory>('admin/categories'),
  getCategories,
};

export default categoryApi;
