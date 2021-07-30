import useSWR, { SWRResponse } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { ApiPostsEndpointResult } from '../../pages/api/posts';
import {
  GetPostsApiResult,
  GetAllPostsParams,
  GetPostsByAuthorParams,
  GetPostsByIdParams,
} from '../../server/types/GetPosts';

export type UsePostsVariables = {
  getAllPostsParams?: GetAllPostsParams;
  getPostsByAuthorParams?: GetPostsByAuthorParams;
  getPostsByIdParams?: GetPostsByIdParams;
};

export type UsePostsState = {
  loading: boolean;
  swr: SWRResponse<ApiPostsEndpointResult, Error>;
  postsData?: GetPostsApiResult;
  error?: Error;
};

// 2nd key is the stringified JSON for URL search params
type UsePostsSwrKeyType = ['/api/posts', string];

export const getUsePostsSwrKey = (
  variables: UsePostsVariables
): UsePostsSwrKeyType => {
  let urlParams: Record<string, string | string[]>;

  if (variables.getAllPostsParams != null) {
    // Handle get all posts
    const params = variables.getAllPostsParams;

    urlParams = {
      tallyIndex: params.tallyIndex.toFixed(0),
    };

    if (params.minVoteScore != null) {
      urlParams.minVoteScore = params.minVoteScore.toFixed(0);
    }
  } else if (variables.getPostsByAuthorParams != null) {
    // Handle get by author
    urlParams = {
      authorId: variables.getPostsByAuthorParams.authorId,
    };
  } else if (variables.getPostsByIdParams != null) {
    // Handle get by ID
    urlParams = {
      ids: variables.getPostsByIdParams.ids,
    };
  } else {
    throw Error('Incorrect parameters sent to usePosts');
  }

  return ['/api/posts', JSON.stringify(urlParams)];
};

const usePostsFetcher: Fetcher<ApiPostsEndpointResult> = async (
  ...key: UsePostsSwrKeyType
) => {
  const [endpoint, stringifiedUrlSearchParams] = key;

  const urlParams = new URLSearchParams(JSON.parse(stringifiedUrlSearchParams));
  const postsData = await fetch(endpoint + '?' + urlParams);

  return postsData.json();
};

export default function usePosts(variables: UsePostsVariables): UsePostsState {
  const swr = useSWR<ApiPostsEndpointResult, Error>(
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
