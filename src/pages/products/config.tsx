import Avatar from 'components/Avatar';
import Label from 'components/Label';
import { ProductTypeEnums } from 'utils/enums';

export const productComlumns = [
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
    title: 'Code',
    dataIndex: 'code',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    hideInSearch: true,
    render(value: any, data: any, index: any) {
      return (
        <Label
          color={
            data?.type === ProductTypeEnums.EXTRA
              ? 'info'
              : data?.type === ProductTypeEnums.GIFT
              ? 'secondary'
              : 'warning'
          }
        >
          {data?.type === ProductTypeEnums.EXTRA
            ? 'Sản phẩm con'
            : data?.type === ProductTypeEnums.GIFT
            ? 'Quà tặng'
            : 'Sản phẩm đơn'}
        </Label>
      );
    },
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
