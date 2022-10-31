import areaApi from 'apis/area';
import { useQuery } from 'react-query';

const useGetAll = (params?: any) =>
  useQuery(['areas', params], () => areaApi.get(params).then((res) => res.data), {
    refetchOnWindowFocus: false,
  });

const areaHooks = {
  useGetAll,
};

export default areaHooks;
