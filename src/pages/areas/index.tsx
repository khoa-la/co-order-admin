import { Stack } from '@mui/material';
import areaApi from 'apis/area';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import ResoTable from 'components/table/reso-table/ResoTable';
import useLocales from 'hooks/useLocales';
import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from 'react-query';
import { PATH_DASHBOARD } from 'routes/paths';
import request from 'utils/axios';

function AreaListPage() {
  // const { data: user } = useQuery(['areas'], () => areaApi.getAreas, {
  //   select: (res) => res,
  // });
  // console.log(user);

  const { translate } = useLocales();
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();
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
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    // },
    // {
    //   title: 'Phí ship',
    //   dataIndex: 'shippingFee',
    // },
    // {
    //   title: 'Kích hoạt',
    //   dataIndex: 'active',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'createdDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
  ];

  return (
    <Page
      title={`Area`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('Dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Order`,
              href: PATH_DASHBOARD.area.root,
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
          // onEdit={(course: any) => {
          //   navigate(`${PATH_DASHBOARD.courses.root}/${course.id}`);
          //   setIsUpdate(true);
          // }}
          // onView={(course: any) => navigate(`${PATH_DASHBOARD.courses.root}/${course.id}/view`)}
          getData={areaApi.getAreas}
          // onDelete={setCurrentItem}
          columns={columns}
        />
      </Stack>
    </Page>
  );
}

export default AreaListPage;
