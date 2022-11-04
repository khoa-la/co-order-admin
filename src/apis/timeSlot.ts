import { TTimeSlotInMenu } from 'types/timeSlot';
import { generateAPI, generateAPIWithPaging } from './utils';
import request from 'utils/axios';
import { AxiosResponse } from 'axios';
import { BaseReponse } from 'types/response';

const getTimeSlotsInMenu = (menuId: number, params?: any) =>
  request.get(`/admin/menus/${menuId}/time-slots`, { params });

const create = (menuId: number, data: TTimeSlotInMenu) =>
  request.post<TTimeSlotInMenu>(`/admin/menus/${menuId}/time-slots`, { data });

const update = (menuId: number, data: TTimeSlotInMenu) =>
  request.put(`/admin/menus/${menuId}/time-slots`, { data });

const remove = (menuId: number, timeSlotId: number) =>
  request.delete(`/admin/menus/${menuId}/time-slots/${timeSlotId}`);

const timeSlotInMenuApi = {
  getTimeSlotsInMenu,
  create,
  update,
  remove,
};

export default timeSlotInMenuApi;
