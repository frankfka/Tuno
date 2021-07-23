import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import EndpointResult from '../../../types/EndpointResult';
import User from '../../../types/User';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<User>>
) {
  const appService = await getServerAppService();
  const session = await getRequestSession(req, appService);

  if (session == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const userResult = await executeAsyncForResult(async () => {
    const user = await appService.getUser(session.authIdentifier);
    if (user != null) {
      return user;
    }

    throw Error('User does not exist');
  });

  res.status(200).json(resultToEndpointResult(userResult));
}
