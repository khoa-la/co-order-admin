import { TArea } from 'types/area';
import { generateAPIWithPaging } from './utils';
import request from 'utils/axios';

const getAreas = (params?: any) => request.get('/admin/areas', { params });

const areaApi = {
  ...generateAPIWithPaging<TArea>('admin/areas'),
  getAreas,
};

export default areaApi;
