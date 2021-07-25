import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Bad Request',
    });
    return;
  }

  // TODO: Auth here
  const appService = await getServerAppService();

  await appService.tallyTopPost();

  res.status(200).json({});
}
