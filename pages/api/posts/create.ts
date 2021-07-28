import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestUser from '../../../server/reqHandlerUtils/getRequestUser';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import { CreatePostResult } from '../../../server/types/CreatePost';
import EndpointResult from '../../../types/EndpointResult';
import PostContent from '../../../types/PostContent';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

const isValidRequestBody = (body: any): body is PostContent => {
  // Simple check, can expand on this later
  return body.title && body.contentType && body.source;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<CreatePostResult>>
) {
  const appService = await getServerAppService();

  const user = await getRequestUser(req, appService);
  if (user == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const reqBody = req.body;

  if (!isValidRequestBody(reqBody)) {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }

  const createPostResult = await executeAsyncForResult(() => {
    return appService.createPost({
      content: req.body,
      authorId: user.id,
    });
  });

  res.status(200).json(resultToEndpointResult(createPostResult));
}
