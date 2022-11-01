import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Button, Dialog, Stack } from '@mui/material';
import menuApi from 'apis/menu';
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
import { TMenu } from 'types/menu';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

function MenuListPage() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TMenu | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteMenuHandler = () =>
    menuApi
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
      title: 'Ngày hoạt động',
      dataIndex: 'dayFilter',
    },
    {
      title: 'Giờ hoạt động',
      dataIndex: 'hourFilter',
    },
    {
      title: 'Dạng menu',
      dataIndex: 'type',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      valueType: 'datetime',
      hideInSearch: true,
    },
  ];

  return (
    <Page
      title={`Menu`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Menus`,
              href: PATH_DASHBOARD.menu.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-menu"
          component={RouterLink}
          variant="contained"
          to={PATH_DASHBOARD.menu.new}
          startIcon={<Iconify icon={'eva:plus-fill'} />}
        >
          {`Tạo menu`}
        </Button>,
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteMenuHandler}
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
          getData={menuApi.getMenus}
          onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default MenuListPage;
