import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/serverAppService';
import {
  GetPostsApiResult,
  GetPostsParams,
  GetPostsResult,
} from '../../../server/types/GetPosts';
import {
  GetPostsByAuthorParams,
  GetPostsByAuthorResult,
} from '../../../server/types/GetPostsByAuthor';
import EndpointResult from '../../../types/EndpointResult';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

export type ApiPostsEndpointResult = EndpointResult<GetPostsApiResult>;

const parseGetPostByAuthorRequest = (
  queryParams: any
): GetPostsByAuthorParams | undefined => {
  return queryParams.authorId != null
    ? {
        authorId: queryParams.authorId,
      }
    : undefined;
};

const parseGetAllPostsRequest = (queryParams: any): GetPostsParams => {
  return {
    tallyIndex:
      queryParams.tallyIndex != null ? Number(queryParams.tallyIndex) : 0,
    minVoteScore:
      queryParams.minVoteScore != null
        ? Number(queryParams.minVoteScore)
        : undefined,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<GetPostsResult | GetPostsByAuthorResult>>
) {
  const appService = await getServerAppService();

  // Switch depending on the type of request
  const postsResult = await executeAsyncForResult(async () => {
    const getPostsByAuthorParams = parseGetPostByAuthorRequest(req.query);

    if (getPostsByAuthorParams != null) {
      return appService.getPostsByAuthor(getPostsByAuthorParams);
    } else {
      const getAllPostsParams = parseGetAllPostsRequest(req.query);
      const result = await appService.getPosts(getAllPostsParams);
      console.log(result);
      return result;
    }
  });

  res.status(200).json(resultToEndpointResult(postsResult));
}
