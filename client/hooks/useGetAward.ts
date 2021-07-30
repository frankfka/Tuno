import useSWR, { SWRResponse } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { ApiAwardEndpointResult } from '../../pages/api/award';
import { GetAwardParams } from '../../server/types/GetAward';
import { ApiAward } from '../../types/Award';

type UseGetAwardVariables = {} & GetAwardParams;

export type UseGetAwardState = {
  loading: boolean;
  swr: SWRResponse<ApiAwardEndpointResult, Error>;
  award?: ApiAward;
  error?: Error;
};

type UseGetAwardSwrKeyType = ['/api/award', string];

export const getUseGetAwardSwrKey = (
  awardId: string
): UseGetAwardSwrKeyType => {
  return ['/api/award', awardId];
};

const useGetAwardFetcher: Fetcher<ApiAwardEndpointResult> = async (
  ...key: UseGetAwardSwrKeyType
) => {
  const [endpoint, awardId] = key;

  const urlParams = new URLSearchParams({
    id: awardId,
  });
  const awardData = await fetch(endpoint + '?' + urlParams);

  return awardData.json();
};

export default function useGetAward(
  variables: UseGetAwardVariables
): UseGetAwardState {
  const { id } = variables;

  const swr = useSWR<ApiAwardEndpointResult>(
    getUseGetAwardSwrKey(id),
    useGetAwardFetcher
  );
  const { data, error } = swr;

  const award = data?.data?.award;
  const finished = Boolean(data);

  return {
    loading: !finished,
    award,
    error,
    swr,
  };
}
