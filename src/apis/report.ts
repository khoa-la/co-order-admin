import { TReport } from 'types/report';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';

const getReports = (params?: any) => request.get('/admin/reports/overview', { params });

const reportApi = {
  ...generateAPIWithPaging<TReport>('admin/reports/overview'),
  getReports,
};

export default reportApi;
