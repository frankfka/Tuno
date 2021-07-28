import useSWR, { SWRResponse } from 'swr';
import { Fetcher } from 'swr/dist/types';
import { ApiPostEndpointResult } from '../../pages/api/posts/get';
import { GetPostApiResult } from '../../server/types/GetPost';
import { ApiPost } from '../../types/Post';

export type UsePostVariables = {
  postId: string;
};

export type UsePostState = {
  loading: boolean;
  swr: SWRResponse<ApiPostEndpointResult, Error>;
  post?: ApiPost;
  error?: Error;
};

type UsePostSwrKeyType = ['/api/posts/get', string];

export const getUsePostSwrKey = (
  variables: UsePostVariables
): UsePostSwrKeyType => ['/api/posts/get', variables.postId];

const usePostFetcher: Fetcher<ApiPostEndpointResult> = async (
  ...key: UsePostSwrKeyType
) => {
  const [endpoint, postId] = key;

  const urlParams = new URLSearchParams({
    id: postId,
  });

  const postData = await fetch(endpoint + '?' + urlParams);

  return postData.json();
};

export default function usePost(variables: UsePostVariables): UsePostState {
  const swr = useSWR<ApiPostEndpointResult, Error>(
    getUsePostSwrKey(variables),
    usePostFetcher
  );

  const { data, error } = swr;

  return {
    loading: !Boolean(data),
    post: data?.data?.post,
    error,
    swr,
  };
}
