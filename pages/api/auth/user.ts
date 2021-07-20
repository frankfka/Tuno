import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import getCookiesFromRequest from '../../../server/reqHandlerUtils/getCookiesFromRequest';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const session = await getRequestSession(req, appService);

  if (session == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const user = await appService.getUser(session.authIdentifier);
  res.status(200).json({ user });
}
