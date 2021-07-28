import useSWR, { SWRResponse } from 'swr';
import { ApiGlobalEndpointResult } from '../../pages/api/global';
import { ApiGlobalState } from '../../types/GlobalState';
import jsonFetcher from '../util/jsonFetcher';

// TODO: Consider just converting ApiGlobalState to GlobalState here
export type UseGlobalStateDataState = {
  loading: boolean;
  swr: SWRResponse<ApiGlobalEndpointResult, Error>;
  globalState?: ApiGlobalState;
  error?: Error;
};

export const GLOBAL_STATE_SWR_KEY = '/api/global';

export default function useGlobalState(): UseGlobalStateDataState {
  const swr = useSWR<ApiGlobalEndpointResult, Error>(
    GLOBAL_STATE_SWR_KEY,
    jsonFetcher
  );

  const { data, error } = swr;

  return {
    loading: !Boolean(data),
    globalState: data?.data,
    error,
    swr,
  };
}
