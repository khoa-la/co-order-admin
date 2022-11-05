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
import productApi from 'apis/product';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { LoadingButton } from '@mui/lab';
import areaHooks from 'hooks/areas/areaHooks';
import { useQuery } from 'react-query';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'config';
import { fData } from 'utils/formatNumber';
import { AutoCompleteField } from 'components/table/reso-table/components/form';
import { TProduct } from 'types/product';
import categoryApi from 'apis/category';
import { TCategory } from 'types/category';
import { ListProductTypeEnums } from 'utils/enums';
import supplierApi from 'apis/supplier';

function ProductNewEditForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();

  //CATEGORIES
  const { data: categories } = useQuery('categories', async () => categoryApi.get(), {
    select: (res) => res?.data?.data,
  });
  const categoryOptions = categories?.map((c: TCategory) => ({ label: c?.name, value: c?.id }));
  const getCategory = (option: any) => {
    if (!option) return option;
    if (!option?.value) return categoryOptions?.find((opt: any) => opt?.value === option);
    return option;
  };

  //SUPPLIERS
  const { data: suppliers } = useQuery('suppliers', async () => supplierApi.get(), {
    select: (res) => res?.data?.data,
  });
  const supplierOptions = suppliers?.map((c: TSupplier) => ({ label: c?.name, value: c?.id }));
  const getSupplier = (option: any) => {
    if (!option) return option;
    if (!option?.value) return supplierOptions?.find((opt: any) => opt?.value === option);
    return option;
  };

  //PRODUCT
  const { data: product, isLoading } = useQuery(
    ['product', id],
    () => productApi.getById(Number(id)),
    {
      select: (res) => res?.data,
    }
  );

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

  const methods = useForm<TProduct>({
    defaultValues: {
      ...product,
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
    if (product) {
      reset(product);
    }
  }, [product, reset, isLoading]);

  const onSubmit = async (supplier: TProduct) => {
    try {
      !isEdit
        ? await productApi
            .create(supplier)
            .then(() =>
              enqueueSnackbar(`Tạo thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.product.list))
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
        : await productApi
            .update(supplier)
            .then(() =>
              enqueueSnackbar(`Cập nhât thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.product.list))
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
              heading={!isEdit ? 'Tạo sản phẩm' : 'Chỉnh sửa sản phẩm'}
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Products', href: PATH_DASHBOARD.product.list },
                { name: !isEdit ? 'New product' : capitalCase('') },
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
                  {categories ? (
                    <AutoCompleteField
                      options={categoryOptions}
                      getOptionLabel={(value: any) => getCategory(value)?.label || ''}
                      isOptionEqualToValue={(option: any, value: any) => {
                        if (!option) return option;
                        return option?.value === getCategory(value)?.value;
                      }}
                      transformValue={(opt: any) => opt?.value}
                      name="categoryId"
                      size="large"
                      type="text"
                      label="Thể loại"
                      fullWidth
                    />
                  ) : (
                    ''
                  )}
                  {suppliers ? (
                    <AutoCompleteField
                      options={supplierOptions}
                      getOptionLabel={(value: any) => getSupplier(value)?.label || ''}
                      isOptionEqualToValue={(option: any, value: any) => {
                        if (!option) return option;
                        return option?.value === getSupplier(value)?.value;
                      }}
                      transformValue={(opt: any) => opt?.value}
                      name="supplierId"
                      size="large"
                      type="text"
                      label="Nhà cung cấp"
                      fullWidth
                    />
                  ) : (
                    ''
                  )}
                  <RHFSelect name="type" label="Loại" placeholder="Loại">
                    <option value="" />
                    {ListProductTypeEnums.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </RHFSelect>
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

export default ProductNewEditForm;
