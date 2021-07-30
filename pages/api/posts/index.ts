import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/serverAppService';
import {
  GetPostsApiResult,
  GetAllPostsParams,
  GetPostsResult,
  GetPostsByIdParams,
  GetPostsByAuthorParams,
} from '../../../server/types/GetPosts';
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

const parseGetByIdsRequest = (
  queryParams: any
): GetPostsByIdParams | undefined => {
  return queryParams.ids != null
    ? {
        ids: queryParams.ids,
      }
    : undefined;
};

const parseGetAllPostsRequest = (queryParams: any): GetAllPostsParams => {
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
  res: NextApiResponse<EndpointResult<GetPostsResult>>
) {
  const appService = await getServerAppService();

  // Switch depending on the type of request
  const postsResult = await executeAsyncForResult(async () => {
    const getPostsByAuthorParams = parseGetPostByAuthorRequest(req.query);
    const getPostsByIdParams = parseGetByIdsRequest(req.query);

    if (getPostsByAuthorParams != null) {
      // By Author
      return appService.getPostsByAuthor(getPostsByAuthorParams);
    } else if (getPostsByIdParams != null) {
      // By IDs
      return appService.getPostsById({
        ids: getPostsByIdParams.ids,
      });
    } else {
      // Default to all posts
      const getAllPostsParams = parseGetAllPostsRequest(req.query);
      return await appService.getAllPosts(getAllPostsParams);
    }
  });

  res.status(200).json(resultToEndpointResult(postsResult));
}
