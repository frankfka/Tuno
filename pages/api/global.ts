import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';
import EndpointResult from '../../types/EndpointResult';
import GlobalState, { ApiGlobalState } from '../../types/GlobalState';
import executeAsyncForResult from '../../util/executeAsyncForResult';
import resultToEndpointResult from '../../util/resultToEndpointResult';

export type ApiGlobalEndpointResult = EndpointResult<ApiGlobalState>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<GlobalState>>
) {
  if (req.method !== 'GET') {
    res.status(400).json({ error: 'Invalid method' });
    return;
  }

  const appService = await getServerAppService();
  const globalStateResult = await executeAsyncForResult(async () =>
    appService.getGlobalState()
  );
  res.status(200).json(resultToEndpointResult(globalStateResult));
}
