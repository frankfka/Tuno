import useSWR, { SWRResponse } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { GetPostsParams, GetPostsResult } from '../../server/types/GetPosts';
import EndpointResult from '../../types/EndpointResult';

export type UsePostsVariables = {} & GetPostsParams;

type UsePostsState = {
  loading: boolean;
  swr: SWRResponse<EndpointResult<GetPostsResult>, Error>;
  postsData?: GetPostsResult;
  error?: Error;
};

type UsePostsSwrKeyType = ['/api/posts', number, number | undefined];

export const getUsePostsSwrKey = (
  variables: UsePostsVariables
): UsePostsSwrKeyType => [
  '/api/posts',
  variables.tallyIndex,
  variables.minVoteScore,
];

const usePostsFetcher: Fetcher<EndpointResult<GetPostsResult>> = async (
  ...key: UsePostsSwrKeyType
) => {
  const [endpoint, tallyIndex, minVoteScore] = key;

  const urlParams = new URLSearchParams({
    tallyIndex: tallyIndex.toFixed(0),
  });

  if (minVoteScore != null) {
    urlParams.set('minVoteScore', minVoteScore.toFixed(0));
  }

  const postsData = await fetch(endpoint + '?' + urlParams);
  return postsData.json();
};

export default function usePosts(variables: UsePostsVariables): UsePostsState {
  const swr = useSWR<EndpointResult<GetPostsResult>, Error>(
    getUsePostsSwrKey(variables),
    usePostsFetcher
  );

  const { data, error } = swr;

  return {
    loading: !Boolean(data),
    postsData: data?.data,
    error,
    swr,
  };
}
