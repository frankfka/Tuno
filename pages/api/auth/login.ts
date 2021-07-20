import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/services/serverAppService';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const session = await appService.login(req.headers.authorization ?? '');

  if (session == null) {
    res.status(401).send({
      error: 'Unauthorized',
    });
    return;
  }

  // Set session cookie
  const sessionCookie = await appService.authService.getSessionTokenCookie(
    session
  );
  res.setHeader('Set-Cookie', sessionCookie);

  res.status(200).send({ done: true });
}
