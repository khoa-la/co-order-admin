import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Button, Dialog, Stack } from '@mui/material';
import areaApi from 'apis/area';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { useQuery } from 'react-query';
import { PATH_DASHBOARD } from 'routes/paths';
import request from 'utils/axios';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { TArea } from 'types/area';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

function AreaListPage() {
  // const { data: user } = useQuery(['areas'], () => areaApi.getAreas, {
  //   select: (res) => res,
  // });
  // console.log(user);

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TArea | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteAreaHandler = () =>
    areaApi
      .delete(currentItem?.id!)
      .then(() => setCurrentItem(null))
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên khu vực',
      dataIndex: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Phí ship',
      dataIndex: 'shippingFee',
    },
    // {
    //   title: 'Kích hoạt',
    //   dataIndex: 'active',
    //   hideInSearch: true,
    //   render: (active: any) => {
    //     <Iconify
    //       icon={active ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
    //       sx={{
    //         width: 20,
    //         height: 20,
    //         color: 'success.main',
    //         ...(!active && { color: 'warning.main' }),
    //       }}
    //     />;
    //   },
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
  ];

  return (
    <Page
      title={`Khu vực`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Khu vực`,
              href: PATH_DASHBOARD.area.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-area"
          component={RouterLink}
          variant="contained"
          to={PATH_DASHBOARD.area.new}
          startIcon={<Iconify icon={'eva:plus-fill'} />}
        >
          {`Tạo khu vực`}
        </Button>,
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteAreaHandler}
          title={
            <>
              {translate('common.confirmDeleteTitle')} <strong>{currentItem?.name}</strong>
            </>
          }
        />,
      ]}
    >
      <Stack spacing={2}>
        <ResoTable
          rowKey="id"
          ref={ref}
          defaultFilters={{
            active: true,
          }}
          // onEdit={(course: any) => {
          //   navigate(`${PATH_DASHBOARD.courses.root}/${course.id}`);
          //   setIsUpdate(true);
          // }}
          // onView={(course: any) => navigate(`${PATH_DASHBOARD.courses.root}/${course.id}/view`)}
          getData={areaApi.getAreas}
          onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default AreaListPage;
