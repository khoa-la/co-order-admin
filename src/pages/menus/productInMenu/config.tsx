import Avatar from 'components/Avatar';

export const productInMenuColumns = [
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
