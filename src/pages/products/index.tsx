import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Avatar, Button, Dialog, Stack } from '@mui/material';
import productApi from 'apis/product';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { useQuery } from 'react-query';
import { PATH_DASHBOARD } from 'routes/paths';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { TProduct } from 'types/product';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { productComlumns } from './config';

function ProductListPage() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TProduct | null>(null);

  const deleteAreaHandler = () =>
    productApi
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

  return (
    <Page
      title={`Product`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Areas`,
              href: PATH_DASHBOARD.area.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-product"
          component={RouterLink}
          variant="contained"
          to={PATH_DASHBOARD.product.new}
          startIcon={<Iconify icon={'eva:plus-fill'} />}
        >
          {`Tạo sản phẩm`}
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
          onEdit={(product: any) => {
            navigate(`${PATH_DASHBOARD.product.root}/${product.id}/edit`);
          }}
          onView={(product: any) => navigate(`${PATH_DASHBOARD.product.root}/${product.id}`)}
          getData={productApi.getProducts}
          onDelete={setCurrentItem}
          columns={productComlumns}
        />
      </Stack>
    </Page>
  );
}

export default ProductListPage;
