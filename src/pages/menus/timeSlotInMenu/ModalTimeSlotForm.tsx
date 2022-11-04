import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { EventInput } from '@fullcalendar/common';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  Dialog,
} from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { TTimeSlotInMenu } from 'types/timeSlot';
import request from 'utils/axios';
import { useParams } from 'react-router-dom';
import { cloneElement, useState } from 'react';
import { get } from 'lodash';
import { DialogAnimate } from 'components/animate';

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
    <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(addTimeSLotToMenu)}>
      {cloneElement(trigger, { onClick: handleClick })}
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField name="title" label="Title" />
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={() => setOpen(false)}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add
        </LoadingButton>
      </Dialog>
    </FormProvider>
  );
}
