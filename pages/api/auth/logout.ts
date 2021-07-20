import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import { getServerAppService } from '../../../server/serverAppService';
import getCookiesFromRequest from '../../../server/reqHandlerUtils/getCookiesFromRequest';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const appService = await getServerAppService();
  const session = await getRequestSession(req, appService);

  if (session) {
    await appService.authService.logout(session);

    res.setHeader(
      'Set-Cookie',
      appService.authService.getInvalidatedSessionTokenCookie()
    );
  }

  res.status(200).send({ done: true });
}
