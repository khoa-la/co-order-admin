import { Box, Card, Container, Grid, Stack } from '@mui/material';
import { capitalCase } from 'change-case';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TArea } from 'types/area';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'components/hook-form';
import areaApi from 'apis/area';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { LoadingButton } from '@mui/lab';
import areaHooks from 'hooks/areas/areaHooks';
import { useQuery } from 'react-query';

function AreaNewEditForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();

  // const area = areaHooks.useGetAll;
  // console.log(area);
  // const { data: user } = useQuery(['user', id], () => areaApi.get, {
  //   select: (res) => res,
  // });
  // console.log(user);
  const { data: area } = useQuery(['area', id], () => areaApi.getById(Number(id)), {
    select: (res) => res?.data,
  });

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    // subjects: yup
    //   .array()
    //   .min(1, 'Vui lòng có ít nhất một sản phẩm')
    //   .of(
    //     yup.object().shape({
    //       position: yup.string().required('Vui lòng chọn giá trị'),
    //     })
    //   ),
  });

  const methods = useForm<TArea>({
    defaultValues: {
      ...area,
    },
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

  useEffect(() => {
    if (area) {
      reset(area);
    }
  }, [area, reset]);

  const onSubmit = async (area: TArea) => {
    try {
      !isEdit
        ? await areaApi
            .create(area)
            .then(() =>
              enqueueSnackbar(`Tạo thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.area.list))
            .catch((err: any) => {
              const errMsg = get(
                err.response,
                ['data', 'message'],
                `Có lỗi xảy ra. Vui lòng thử lại`
              );
              enqueueSnackbar(errMsg, {
                variant: 'error',
              });
            })
        : await areaApi
            .update(area)
            .then(() =>
              enqueueSnackbar(`Cập nhât thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.area.list))
            .catch((err: any) => {
              const errMsg = get(
                err.response,
                ['data', 'message'],
                `Có lỗi xảy ra. Vui lòng thử lại`
              );
              enqueueSnackbar(errMsg, {
                variant: 'error',
              });
            });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Page
          title=""
          isTable
          content={
            <HeaderBreadcrumbs
              heading={!isEdit ? 'Tạo khu vực' : 'Chỉnh sửa khu vực'}
              links={[
                { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                { name: 'Khu vực', href: PATH_DASHBOARD.area.list },
                { name: !isEdit ? 'Khu vực mới' : `${id}` },
              ]}
            />
          }
        >
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="name" label="Tên khu vực" />
                <RHFTextField name="shippingFee" label="Phí ship" />
                <RHFTextField name="description" label="Mô tả" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Page>
      </FormProvider>
    </>
  );
}

export default AreaNewEditForm;
