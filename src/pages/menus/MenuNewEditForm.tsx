import { yupResolver } from '@hookform/resolvers/yup';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuIcon from '@mui/icons-material/Menu';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Grid, Stack, Tab } from '@mui/material';
import areaApi from 'apis/area';
import menuApi from 'apis/menu';
import { capitalCase } from 'change-case';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import Label from 'components/Label';
import Page from 'components/Page';
import { AutoCompleteField } from 'components/table/reso-table/components/form';
import useSettings from 'hooks/useSettings';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TArea } from 'types/area';
import { TMenu } from 'types/menu';
import { ListMenuDateFilterEnums, ListMenuHourFilterEnums } from 'utils/enums';
import * as yup from 'yup';
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
    //   .min(1, 'Vui l??ng c?? ??t nh???t m???t s???n ph???m')
    //   .of(
    //     yup.object().shape({
    //       position: yup.string().required('Vui l??ng ch???n gi?? tr???'),
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
              enqueueSnackbar(`T???o th??nh c??ng`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.menu.list))
            .catch((err: any) => {
              const errMsg = get(
                err.response,
                ['data', 'message'],
                `C?? l???i x???y ra. Vui l??ng th??? l???i`
              );
              enqueueSnackbar(errMsg, {
                variant: 'error',
              });
            })
        : await menuApi
            .update(menu)
            .then(() =>
              enqueueSnackbar(`C???p nh??t th??nh c??ng`, {
                variant: 'success',
              })
            )
            .then(() => navigate(PATH_DASHBOARD.menu.list))
            .catch((err: any) => {
              const errMsg = get(
                err.response,
                ['data', 'message'],
                `C?? l???i x???y ra. Vui l??ng th??? l???i`
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
            heading={!isEdit ? 'T???o th???c ????n' : 'Ch???nh s???a th???c ????n'}
            links={[
              { name: 'Trang ch???', href: PATH_DASHBOARD.root },
              { name: 'Th???c ????n', href: PATH_DASHBOARD.menu.list },
              { name: !isEdit ? 'Th???c ????n m???i' : `${id}` },
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
                  label={'Th??ng tin menu'}
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
                  label={'S???n ph???m trong menu'}
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
                  label={'Khung gi??? ho???t ?????ng c???a menu'}
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
                        <RHFTextField name="name" label="T??n menu" />
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
                            label="Khu v???c"
                            fullWidth
                          />
                        ) : (
                          ''
                        )}
                        <RHFSelect
                          name="dayFilter"
                          label="Ng??y ho???t ?????ng"
                          placeholder="Ng??y ho???t ?????ng"
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
                          label="Gi??? ho???t ?????ng"
                          placeholder="Gi??? ho???t ?????ng"
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
