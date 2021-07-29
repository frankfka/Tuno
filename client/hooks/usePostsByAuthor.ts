import useSWR, { SWRResponse } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { ApiPostsEndpointResult } from '../../pages/api/posts';
import { GetPostsApiResult } from '../../server/types/GetPosts';
import { GetPostsByAuthorParams } from '../../server/types/GetPostsByAuthor';

// TODO: Try to combine this with usePosts
export type UsePostsByAuthorVariables = {} & GetPostsByAuthorParams;

export type UsePostsByAuthorState = {
  loading: boolean;
  swr: SWRResponse<ApiPostsEndpointResult, Error>;
  postsData?: GetPostsApiResult;
  error?: Error;
};

type UsePostsByAuthorSwrKeyType = ['/api/posts', string];

export const getUsePostsByAuthorSwrKey = (
  variables: UsePostsByAuthorVariables
): UsePostsByAuthorSwrKeyType => ['/api/posts', variables.authorId];

const usePostsByAuthorFetcher: Fetcher<ApiPostsEndpointResult> = async (
  ...key: UsePostsByAuthorSwrKeyType
) => {
  const [endpoint, authorId] = key;

  const urlParams = new URLSearchParams({
    authorId: authorId,
  });

  const postsData = await fetch(endpoint + '?' + urlParams);

  return postsData.json();
};

export default function usePostsByAuthor(
  variables: UsePostsByAuthorVariables
): UsePostsByAuthorState {
  const swr = useSWR<ApiPostsEndpointResult, Error>(
    getUsePostsByAuthorSwrKey(variables),
    usePostsByAuthorFetcher
  );

  const { data, error } = swr;

  return {
    loading: !Boolean(data),
    postsData: data?.data,
    error,
    swr,
  };
}
