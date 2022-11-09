import Avatar from 'components/Avatar';

export const timeSlotInMenuColumns = [
  {
    title: 'STT',
    dataIndex: 'index',
    hideInSearch: true,
  },
  {
    title: 'Giờ bắt đầu',
    dataIndex: 'startTime',
    valueType: 'time',
    hideInSearch: true,
  },
  {
    title: 'Giờ kết thúc',
    dataIndex: 'endTime',
    valueType: 'time',
    hideInSearch: true,
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    valueType: 'datetime',
    hideInSearch: true,
  },
];
