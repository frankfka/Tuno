import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/services/serverAppService';
import getCookiesFromRequest from '../../../util/getCookiesFromRequest';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const userAuth = await appService.authService.getSessionFromCookies(
    getCookiesFromRequest(req)
  );

  if (userAuth == null) {
    res.status(401).json({
      error: 'Invalid authentication',
    });
    return;
  }

  const user = await appService.getUser(userAuth.authIdentifier);
  res.status(200).json({ user });
}
