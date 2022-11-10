import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Button, Dialog, Stack } from '@mui/material';
import menuApi from 'apis/menu';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import * as yup from 'yup';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useQuery } from 'react-query';
import { PATH_DASHBOARD } from 'routes/paths';
import request from 'utils/axios';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Avatar from 'components/Avatar';
import timeSlotInMenuApi from 'apis/timeSlot';
import { timeSlotInMenuColumns } from './config';
import { TTimeSlotInMenu } from 'types/timeSlot';
import { FormProvider } from 'components/hook-form';
import ModalTimeSlotForm from './ModalTimeSlotForm';

function TimeSlotInMenuListPage() {
  const { translate } = useLocales();
  const { id: menuId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TTimeSlotInMenu | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteMenuHandler = () =>
    timeSlotInMenuApi
      .remove(Number(menuId), currentItem?.id!)
      .then(() => setCurrentItem(null))
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công khung giờ`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const addTimeSlotToMenu = async (data: TTimeSlotInMenu) => {
    try {
      await timeSlotInMenuApi.create(Number(menuId), data);
      enqueueSnackbar('common.201', {
        variant: 'success',
      });
      ref.current?.reload();
    } catch (err) {
      console.log(`err.response`, err as any);
      const errMsg = get(err as any, ['message'], `Có lỗi xảy ra. Vui lòng thử lại`);
      enqueueSnackbar(errMsg, {
        variant: 'error',
      });
    }
  };

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const methods = useForm<TTimeSlotInMenu>({
    resolver: yupResolver(schema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  return (
    // <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(addTimeSlotToMenu)}>
    <Page
      title={``}
      isTable
      sx={{ m: 2 }}
      actions={() => [
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteMenuHandler}
          title={<>{translate('common.confirmDeleteTitle')}</>}
        />,
      ]}
    >
      <Stack justifyContent="flex-end" mb={2} direction="row" spacing={2}>
        <ModalTimeSlotForm
          onSubmit={addTimeSlotToMenu}
          trigger={<Button variant="outlined">Thêm khung giờ</Button>}
        />
      </Stack>
      <Stack spacing={2}>
        <ResoTable
          rowKey="id"
          ref={ref}
          defaultFilters={{
            active: 1,
          }}
          getData={() =>
            timeSlotInMenuApi.getTimeSlotsInMenu(Number(menuId), {
              active: true,
            })
          }
          onDelete={setCurrentItem}
          columns={timeSlotInMenuColumns}
        />
      </Stack>
    </Page>
    // </FormProvider>
  );
}

export default TimeSlotInMenuListPage;
