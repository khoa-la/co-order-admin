import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { capitalCase } from 'change-case';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TSupplier } from 'types/supplier';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import supplierApi from 'apis/supplier';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { LoadingButton } from '@mui/lab';
import areaHooks from 'hooks/areas/areaHooks';
import { useQuery } from 'react-query';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'config';
import { fData } from 'utils/formatNumber';
import areaApi from 'apis/area';
import { AutoCompleteField } from 'components/table/reso-table/components/form';
import { TArea } from 'types/area';

function SupplierNewEditForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();

  const { data: areas } = useQuery('areas', async () => areaApi.get(), {
    select: (res) => res?.data?.data,
  });
  console.log(areas);
  const areaOptions = areas?.map((c: TArea) => ({ label: c?.name, value: c?.id }));
  const getArea = (option: any) => {
    if (!option) return option;
    if (!option?.value) return areaOptions?.find((opt: any) => opt?.value === option);
    return option;
  };

  const types = [
    {
      id: 1,
      name: 'NORMAL',
    },
    {
      id: 2,
      name: 'PARTY',
    },
  ];
  const typeOptions = types?.map((c: any) => ({ label: c?.name, value: c?.id }));
  const getType = (option: any) => {
    if (!option) return option;
    if (!option?.value) return typeOptions?.find((opt: any) => opt?.value === option);
    return option;
  };

  const { data: supplier } = useQuery(['supplier', id], () => supplierApi.getById(Number(id)), {
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

  const methods = useForm<TSupplier>({
    defaultValues: {
      ...supplier,
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
    if (supplier) {
      reset(supplier);
    }
  }, [supplier, reset]);

  const onSubmit = async (supplier: TSupplier) => {
    try {
      !isEdit
        ? await supplierApi
            .create(supplier)
            .then(() =>
              enqueueSnackbar(`Tạo thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.supplier.list))
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
        : await supplierApi
            .update(supplier)
            .then(() =>
              enqueueSnackbar(`Cập nhât thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.supplier.list))
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            setValue('imageUrl', url);
          });
        }
      );
    },
    [setValue]
  );

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Page
          title=""
          isTable
          content={
            <HeaderBreadcrumbs
              heading={!isEdit ? 'Tạo nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}
              links={[
                { name: 'Trang chủ', href: PATH_DASHBOARD.root },
                { name: 'Nhà cung cấp', href: PATH_DASHBOARD.supplier.list },
                { name: !isEdit ? 'Nhà cung cấp mới' : `${id}` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <RHFUploadAvatar
                  name="imageUrl"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name="name" label="Tên nhà cung cấp" />
                  <RHFTextField name="contact" label="Thông tin liên hệ" />
                  <RHFTextField name="address" label="Địa chỉ" />
                  {areas ? (
                    <AutoCompleteField
                      options={areaOptions}
                      getOptionLabel={(value: any) => getArea(value)?.label || ''}
                      isOptionEqualToValue={(option: any, value: any) => {
                        if (!option) return option;
                        return option?.value === getArea(value)?.value;
                      }}
                      transformValue={(opt: any) => opt?.value}
                      name="areaId"
                      size="large"
                      type="text"
                      label="Khu vực"
                      fullWidth
                    />
                  ) : (
                    ''
                  )}
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Page>
      </FormProvider>
    </>
  );
}

export default SupplierNewEditForm;
