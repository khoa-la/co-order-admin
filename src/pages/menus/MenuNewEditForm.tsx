import { Box, Card, Container, Grid, Stack, Tab, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import areaHooks from 'hooks/areas/areaHooks';
import { useQuery } from 'react-query';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'config';
import { fData } from 'utils/formatNumber';
import productApi from 'apis/product';
import { AutoCompleteField } from 'components/table/reso-table/components/form';
import { TProduct } from 'types/product';
import categoryApi from 'apis/category';
import { TCategory } from 'types/category';
import {
  ListMenuDateFilterEnums,
  ListMenuHourFilterEnums,
  ListProductTypeEnums,
} from 'utils/enums';
import areaApi from 'apis/area';
import { TArea } from 'types/area';
import menuApi from 'apis/menu';
import { TMenu } from 'types/menu';
import Label from 'components/Label';
import ProductInMenuListPage from './productInMenu';
import TimeSlotInMenuListPage from './timeSlotInMenu';

function MenuNewEditForm() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  //AREAS
  const { data: areas } = useQuery('areas', async () => areaApi.get(), {
    select: (res) => res?.data?.data,
  });
  const areaOptions = areas?.map((c: TArea) => ({ label: c?.name, value: c?.id }));
  const getArea = (option: any) => {
    if (!option) return option;
    if (!option?.value) return areaOptions?.find((opt: any) => opt?.value === option);
    return option;
  };

  //MENU
  const { data: menu, isLoading } = useQuery(['menu', id], () => menuApi.getById(Number(id)), {
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

  const methods = useForm<TMenu>({
    defaultValues: {
      ...menu,
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
    if (menu) {
      reset(menu);
    }
  }, [menu, reset]);

  const onSubmit = async (menu: TMenu) => {
    try {
      !isEdit
        ? await menuApi
            .create(menu)
            .then(() =>
              enqueueSnackbar(`Tạo thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.menu.list))
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
        : await menuApi
            .update(menu)
            .then(() =>
              enqueueSnackbar(`Cập nhât thành công`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.menu.list))
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
      <Page
        title=""
        isTable
        content={
          <HeaderBreadcrumbs
            heading={!isEdit ? 'Tạo thực đơn' : 'Chỉnh sửa thực đơn'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Menus', href: PATH_DASHBOARD.product.list },
              { name: !isEdit ? 'New menu' : capitalCase('') },
            ]}
          />
        }
      >
        <Card>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{ px: 2, bgcolor: 'background.neutral' }}
                variant="scrollable"
              >
                <Tab
                  disableRipple
                  label={'Thông tin menu'}
                  icon={
                    <Label color={'success'}>
                      <MenuIcon />
                    </Label>
                  }
                  value="1"
                  sx={{ px: 2 }}
                />
                <Tab
                  disableRipple
                  label={'Sản phẩm trong menu'}
                  icon={
                    <Label color={'warning'}>
                      <FastfoodIcon />
                    </Label>
                  }
                  value="2"
                  sx={{ px: 2 }}
                />
                <Tab
                  disableRipple
                  label={'Khung giờ hoạt động của menu'}
                  icon={
                    <Label color={'warning'}>
                      <AccessTimeIcon />
                    </Label>
                  }
                  value="3"
                  sx={{ px: 2 }}
                />
              </TabList>
            </Box>
            <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <TabPanel value="1">
                <Grid container spacing={3}>
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
                        <RHFTextField name="name" label="Tên menu" />
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
                        <RHFSelect
                          name="dayFilter"
                          label="Ngày hoạt động"
                          placeholder="Ngày hoạt động"
                        >
                          <option value="" />
                          {ListMenuDateFilterEnums.map((option) => (
                            <option key={option.id} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                        </RHFSelect>
                        <RHFSelect
                          name="hourFilter"
                          label="Giờ hoạt động"
                          placeholder="Giờ hoạt động"
                        >
                          <option value="" />
                          {ListMenuHourFilterEnums.map((option) => (
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
              </TabPanel>
            </FormProvider>

            <TabPanel value="2">
              <ProductInMenuListPage />
            </TabPanel>
            <TabPanel value="3">
              <TimeSlotInMenuListPage />
            </TabPanel>
          </TabContext>
        </Card>
      </Page>
    </>
  );
}

export default MenuNewEditForm;
