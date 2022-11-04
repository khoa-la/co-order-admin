import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Avatar, Button, Dialog, Stack } from '@mui/material';
import categoryApi from 'apis/category';
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
import { TCategory } from 'types/category';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

function CategoryListPage() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TCategory | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteCategoryHandler = () =>
    categoryApi
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
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      hideInSearch: true,
      render: (src: any, { title }: any) => (
        <Avatar alt={title} src={src} style={{ width: '54px', height: '54px' }} />
      ),
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      valueType: 'datetime',
      hideInSearch: true,
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
      title={`Danh mục`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Danh mục`,
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
          to={PATH_DASHBOARD.category.new}
          startIcon={<Iconify icon={'eva:plus-fill'} />}
        >
          {`Tạo danh mục`}
        </Button>,
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteCategoryHandler}
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
          getData={categoryApi.getCategories}
          onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default CategoryListPage;
