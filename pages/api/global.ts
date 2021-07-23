import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';
import GlobalState from '../../types/GlobalState';

type Data = GlobalState;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getServerAppService();
  res.status(200).json(await appService.databaseService.getGlobalStateData());
}
