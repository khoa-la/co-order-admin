import { TArea } from 'types/area';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getAreas = (params?: any) =>
  request.get<AxiosResponse<TArea[]>>('/admin/areas', { params }).then((res) => res?.data?.data);

const areaApi = {
  ...generateAPIWithPaging<TArea>('admin/areas'),
  ...generateAPI<TArea>('admin/areas'),
  getAreas,
};

export default areaApi;
