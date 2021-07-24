import { NextApiRequest } from 'next';
import User from '../../types/User';
import { ServerAppService } from '../serverAppService';

import getRequestSession from './getRequestSession';

const getRequestUser = async (
  req: NextApiRequest,
  appService: ServerAppService
): Promise<User | undefined> => {
  const session = await getRequestSession(req, appService);
  if (session == null) {
    return;
  }

  return appService.getUser(session.authIdentifier);
};

export default getRequestUser;
