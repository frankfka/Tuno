import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import PostContent from '../../../types/PostContent';

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getServerAppService();
  const session = await getRequestSession(req, appService);

  if (session == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  // TODO: extract getting user into getRequestSession / getRequestAuthor
  const user = await appService.getUser(session.authIdentifier);
  if (user == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const post = await appService.databaseService.createPost(
    req.body as PostContent,
    user.id
  );
  console.log(post);

  res.status(200).json({ name: 'John Doe' });
}
