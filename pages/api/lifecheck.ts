import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';
import EndpointResult from '../../types/EndpointResult';
import GlobalState, { ApiGlobalState } from '../../types/GlobalState';
import executeAsyncForResult from '../../util/executeAsyncForResult';
import resultToEndpointResult from '../../util/resultToEndpointResult';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create app service and execute something
  const appService = await getServerAppService();

  const globalState = await appService.getGlobalState();
  console.log('Lifecheck', globalState.voteLimit);

  res.status(200).json({
    result: 'hola!',
  });
}
