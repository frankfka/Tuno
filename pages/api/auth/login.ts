import type { NextApiRequest, NextApiResponse } from 'next';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const session = await appService.login(req.headers.authorization ?? '');

  if (session == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  // Set session cookie
  const sessionCookie = await appService.authService.getSessionTokenCookie(
    session
  );
  res.setHeader('Set-Cookie', sessionCookie);

  res.status(200).send({ done: true });
}
