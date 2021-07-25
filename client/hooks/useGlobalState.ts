import useSWR, { SWRResponse } from 'swr';
import EndpointResult from '../../types/EndpointResult';
import GlobalState from '../../types/GlobalState';
import jsonFetcher from '../util/jsonFetcher';

type UseGlobalStateDataState = {
  loading: boolean;
  swr: SWRResponse<EndpointResult<GlobalState>, Error>;
  globalState?: GlobalState;
  error?: Error;
};

export const GLOBAL_STATE_SWR_KEY = '/api/global';

export default function useGlobalState(): UseGlobalStateDataState {
  const swr = useSWR<EndpointResult<GlobalState>, Error>(
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
