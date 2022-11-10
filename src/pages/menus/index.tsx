import { Button, Stack } from '@mui/material';
import menuApi from 'apis/menu';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TMenu } from 'types/menu';

function MenuListPage() {
  const { translate } = useLocales();
  const navigate = useNavigate();
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
          onEdit={(menu: any) => {
            navigate(`${PATH_DASHBOARD.menu.root}/${menu.id}/edit`);
          }}
          // onView={(menu: any) => navigate(`${PATH_DASHBOARD.menu.root}/${menu.id}`)}
          getData={menuApi.getMenus}
          onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default MenuListPage;
