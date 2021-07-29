import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import getRequestUser from '../../../server/reqHandlerUtils/getRequestUser';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import EndpointResult from '../../../types/EndpointResult';
import User, { ApiUser } from '../../../types/User';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

export type ApiUserEndpointResult = EndpointResult<ApiUser>;

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<User>>
) {
  const appService = await getServerAppService();

  const userResult = await executeAsyncForResult(async () => {
    const user = await getRequestUser(req, appService);
    if (user != null) {
      return user;
    }

    throw Error('User does not exist');
  });

  res.status(200).json(resultToEndpointResult(userResult));
}
