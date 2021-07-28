import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/serverAppService';
import {
  GetPostApiResult,
  GetPostParams,
  GetPostResult,
} from '../../../server/types/GetPost';
import EndpointResult from '../../../types/EndpointResult';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

export type ApiPostEndpointResult = EndpointResult<GetPostApiResult>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<GetPostResult>>
) {
  const postId = req.query.id;

  if (postId == null || typeof postId !== 'string') {
    res.status(400).json({
      error: 'Invalid post ID',
    });
    return;
  }

  const appService = await getServerAppService();
  const postResult = await executeAsyncForResult(async () => {
    const post = await appService.getPostById({ id: postId });
    if (post == null) {
      throw Error('Post not found');
    }
    return {
      post,
    };
  });

  res.status(200).json(resultToEndpointResult(postResult));
}
