import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, Stack, TextField } from '@mui/material';
// redux
// components
import { get } from 'lodash';
import { cloneElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TTimeSlotInMenu } from 'types/timeSlot';
import request from 'utils/axios';
import { FormProvider } from '../../../components/hook-form';
import { TimePickerField } from 'components/table/reso-table/components/form';

// ----------------------------------------------------------------------

export default function ModalTimeSlotForm({ trigger, onSubmit }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const { id: menuId } = useParams();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const schema = Yup.object().shape({
    // name: yup.string().required('Name is required'),
  });

  const methods = useForm<any>();

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const addTimeSLotToMenu = async (timneSlotInMenu: TTimeSlotInMenu) => {
    console.log(timneSlotInMenu);
    try {
      await request
        .post(`/admin/menus/${Number(menuId)}/time-slots`, timneSlotInMenu)
        .then(() => setOpen(false));
      enqueueSnackbar('Thành công', {
        variant: 'success',
      });
    } catch (err) {
      console.log(`err.response`, err as any);
      const errMsg = get(err as any, ['message'], `Có lỗi xảy ra. Vui lòng thử lại`);
      enqueueSnackbar(errMsg, {
        variant: 'error',
      });
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.endTime), new Date(values.startTime));

  return (
    <FormProvider {...methods} methods={methods}>
      {cloneElement(trigger, { onClick: handleClick })}
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <TimePickerField name={'startTime'} label={'Giờ bắt đầu'} />
          <TimePickerField name={'endTime'} label={'Giờ kết thúc'} />
        </Stack>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" color="inherit" onClick={() => setOpen(false)}>
            Huỷ
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={handleSubmit(addTimeSLotToMenu)}
          >
            Thêm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
