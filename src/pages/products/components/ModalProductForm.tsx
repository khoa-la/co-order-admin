import { yupResolver } from '@hookform/resolvers/yup';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import productApi from 'apis/product';
import productInMenuApi from 'apis/productInMenu';
import { FormProvider, RHFTextField } from 'components/hook-form';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { InputField } from 'components/table/reso-table/components/form';
import ResoTable from 'components/table/reso-table/ResoTable';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { TProductInMenu } from 'types/productInMenu';
import { productComlumns } from '../config';
import { LoadingButton } from '@mui/lab';
import request from 'utils/axios';

const ModalProductForm = ({ trigger, onSubmit, selected, type = 'radio' }: any) => {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<any>();

  const [selectedProductId, setSelectedProductId] = React.useState();
  const [selectedProduct, setSelectedProduct] = React.useState<TProductInMenu>();

  const schema = yup.object().shape({
    // name: yup.string().required('Name is required'),
  });

  const methods = useForm<TProductInMenu>({
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

  const handleClick = () => {
    setOpen(true);
  };

  const submit = () =>
    Promise.resolve(onSubmit && onSubmit(selectedProductId, selectedProduct)).then(() =>
      setOpen(false)
    );

  const handleChangeSelection = React.useCallback(
    (id, data) => {
      setSelectedProductId(id);
      setSelectedProduct(data);
      setValue('productId', Number(id));
    },
    [setValue]
  );

  const { id: menuId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const addProductToMenu = async (productInMenu: TProductInMenu) => {
    try {
      await request
        .post(`/admin/menus/${Number(menuId)}/products`, productInMenu)
        .then(() => setOpen(false))
        .then(() => ref.current?.reload());
      enqueueSnackbar('common.201', {
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

  return (
    <>
      {React.cloneElement(trigger, { onClick: handleClick })}
      <Dialog maxWidth="md" open={open} onClose={() => setOpen(false)}>
        <Box display="flex" flexDirection="column" maxHeight="80vh">
          <Paper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              pt={0}
              borderBottom={1}
              borderColor="grey.300"
              textAlign="right"
            >
              <Typography variant="h6">Thêm sản phẩm vào thực đơn</Typography>
              <IconButton aria-label="close" onClick={() => setOpen(false)} size="large">
                <Icon icon={closeFill} />
              </IconButton>
            </Box>
          </Paper>

          <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(addProductToMenu)}>
            <Box p={1} sx={{ flex: 1, overflowY: 'auto' }}>
              <Stack spacing={2}>
                <ResoTable
                  checkboxSelection={{
                    selection: selectedProductId,
                    type: type,
                  }}
                  ref={ref}
                  showAction={false}
                  scroll={{ y: '50%', x: '100%' }}
                  rowKey="id"
                  getData={productApi.getProducts}
                  onChangeSelection={handleChangeSelection}
                  columns={productComlumns}
                />
                <RHFTextField
                  name="cost"
                  type={'number'}
                  onChange={(event) => setValue(`cost`, Number(event.target.value))}
                  label="Giá mua"
                />
                <RHFTextField
                  name="price"
                  type={'number'}
                  onChange={(event) => setValue(`price`, Number(event.target.value))}
                  label="Giá bán"
                />
                <RHFTextField
                  name="discount"
                  type={'number'}
                  onChange={(event) => setValue(`discount`, Number(event.target.value))}
                  label="Giảm giá"
                />
                <RHFTextField
                  name="displayOrder"
                  type={'number'}
                  onChange={(event) => setValue(`displayOrder`, Number(event.target.value))}
                  label="Thứ tự ưu tiên hiển thị"
                />
              </Stack>
            </Box>

            <Box
              p={2}
              borderTop={1}
              borderColor="grey.300"
              component={Paper}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* <Typography variant="body1">
              Đã chọn <strong>{selectedProductId.length}</strong> sản phẩm
            </Typography> */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Thêm
                </LoadingButton>
              </Stack>
            </Box>
          </FormProvider>
        </Box>
      </Dialog>
    </>
  );
};

export default ModalProductForm;
