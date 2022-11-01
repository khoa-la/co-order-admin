import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { capitalCase } from 'change-case';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TCategory } from 'types/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import categoryApi from 'apis/category';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { LoadingButton } from '@mui/lab';
import areaHooks from 'hooks/areas/areaHooks';
import { useQuery } from 'react-query';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'config';
import { fData } from 'utils/formatNumber';

function CategoryNewEditForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();

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

  const methods = useForm<TCategory>({
    defaultValues: {
      name: '',
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

  const onSubmit = async (area: TCategory) => {
    try {
      !isEdit
        ? await categoryApi
            .create(area)
            .then(() =>
              enqueueSnackbar(`Tạo thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.category.list))
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
        : await categoryApi
            .update(area.id, area)
            .then(() =>
              enqueueSnackbar(`Cập nhât thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.category.list))
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
              heading={!isEdit ? 'Create a new arew' : 'Edit area'}
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Areas', href: PATH_DASHBOARD.area.list },
                { name: !isEdit ? 'New area' : capitalCase('') },
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
                <RHFTextField name="name" label="Tên danh mục" />
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

export default CategoryNewEditForm;
