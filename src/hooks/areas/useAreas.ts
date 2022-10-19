import areaApi from 'apis/area';
import { useQuery } from 'react-query';

const useGetAll = (params?: any) =>
  useQuery(['areas', params], () => areaApi.get(params).then((res) => res.data.data), {
    refetchOnWindowFocus: false,
  });

const useAreas = {
  useGetAll,
};

export default useAreas;
