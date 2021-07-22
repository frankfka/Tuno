import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/serverAppService';
import { GetPostsParams, GetPostsResult } from '../../../server/types/GetPosts';
import EndpointResult from '../../../types/EndpointResult';
import Result from '../../../types/Result';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

type ValidGetPostsRequest = GetPostsParams;

const parseGetPostsRequest = (queryParams: any): ValidGetPostsRequest => {
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
  const reqParams = parseGetPostsRequest(req.query);

  const appService = await getServerAppService();
  const postsResult = await executeAsyncForResult(async () =>
    appService.getPosts(reqParams)
  );

  res.status(200).json(resultToEndpointResult(postsResult));
}
