import type { NextApiRequest, NextApiResponse } from 'next';
import UserAuthData from '../auth/UserAuthData';
import { ServerAppService } from '../serverAppService';
import getCookiesFromRequest from './getCookiesFromRequest';

const getRequestSession = async (
  req: NextApiRequest,
  appService: ServerAppService
): Promise<UserAuthData | undefined> => {
  return appService.authService.getSessionFromCookies(
    getCookiesFromRequest(req)
  );
};

export default getRequestSession;
