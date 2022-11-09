import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Button, Dialog, Stack } from '@mui/material';
import orderApi from 'apis/order';
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
import { TOrder } from 'types/order';
import { useSnackbar } from 'notistack';
import { get } from 'lodash';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Label from 'components/Label';
import { OrderStatusEnums } from 'utils/enums';

function OrderListPage() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TOrder | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteMenuHandler = () =>
    orderApi
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
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer.fullName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customer.phoneNumber',
    },
    {
      title: 'Dạng đơn hàng',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'finalAmount',
      hideInSearch: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInSearch: true,
      hideInTable: false,
      sortable: false,
      render(value: any, data: any, index: any) {
        return (
          <Label
            color={
              data?.status === OrderStatusEnums.WAITING
                ? 'info'
                : data?.status === OrderStatusEnums.PENDING
                ? 'warning'
                : data?.status === OrderStatusEnums.FINISHED
                ? 'success'
                : 'error'
            }
          >
            {data?.status}
          </Label>
        );
      },
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
      title={`Order`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Orders`,
              href: PATH_DASHBOARD.order.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
    >
      <Stack spacing={2}>
        <ResoTable
          rowKey="id"
          ref={ref}
          //   onEdit={(menu: any) => {
          //     navigate(`${PATH_DASHBOARD.order.root}/${menu.id}/edit`);
          //   }}
          // onView={(menu: any) => navigate(`${PATH_DASHBOARD.menu.root}/${menu.id}`)}
          getData={orderApi.getOrders}
          onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default OrderListPage;
