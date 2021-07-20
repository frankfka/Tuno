import { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../../server/reqHandlerUtils/getRequestSession';
import sendUnauthorizedResponse from '../../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../../server/serverAppService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId } = req.query;
  if (typeof postId !== 'string' || !postId) {
    res.status(400).json({ error: 'Invalid' });
  }

  const appService = await getServerAppService();
  const session = await getRequestSession(req, appService);

  if (session == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const user = await appService.getUser(session.authIdentifier);
  if (user == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  await appService.databaseService.voteOnPost(user.id, {
    post: postId as string,
    weight: 1,
  });
  res.status(200).json({});
}
