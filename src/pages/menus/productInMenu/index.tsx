import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import productInMenuApi from 'apis/productInMenu';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { FormProvider } from 'components/hook-form';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import ModalProductForm from 'pages/products/components/ModalProductForm';
import { useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TMenu } from 'types/menu';
import { TProductInMenu } from 'types/productInMenu';
import * as yup from 'yup';
import { productInMenuColumns } from './config';

function ProductInMenuListPage() {
  const { translate } = useLocales();
  const { id: menuId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
  const [currentItem, setCurrentItem] = useState<TMenu | null>(null);
  const [formModal, setFormModal] = useState(false);

  const deleteMenuHandler = () =>
    productInMenuApi
      .remove(Number(menuId), currentItem?.id!)
      .then(() => setCurrentItem(null))
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công sản phẩm ${currentItem?.name}`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });

  const addProductToMenu = async (data: TProductInMenu) => {
    try {
      console.log(data);
      await productInMenuApi.create(Number(menuId), data);
      enqueueSnackbar('common.201', {
        variant: 'success',
      });
      ref.current?.reload();
    } catch (err) {
      console.log(`err.response`, err as any);
      const errMsg = get(err as any, ['message'], `Có lỗi xảy ra. Vui lòng thử lại`);
      enqueueSnackbar(errMsg, {
        variant: 'error',
      });
    }
  };

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const methods = useForm<TProductInMenu>({
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

  return (
    <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(addProductToMenu)}>
      <Page
        title={``}
        isTable
        sx={{ m: 2 }}
        actions={() => [
          // <Button
          //   key="create-menu"
          //   component={RouterLink}
          //   variant="contained"
          //   to={PATH_DASHBOARD.menu.new}
          //   startIcon={<Iconify icon={'eva:plus-fill'} />}
          // >
          //   {`Thêm sản phẩm vào menu`}
          // </Button>,
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
        <Stack justifyContent="flex-end" mb={2} direction="row" spacing={2}>
          <ModalProductForm
            onSubmit={addProductToMenu}
            trigger={<Button variant="outlined">Thêm sản phẩm</Button>}
          />
        </Stack>
        <Stack spacing={2}>
          <ResoTable
            rowKey="id"
            ref={ref}
            defaultFilters={{
              active: true,
            }}
            getData={() => productInMenuApi.getProductsInMenu(Number(menuId))}
            onDelete={setCurrentItem}
            columns={productInMenuColumns}
          />
        </Stack>
      </Page>
    </FormProvider>
  );
}

export default ProductInMenuListPage;
