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

  const dateOffset = 1000 * 60 * 5; // 5 minutes
  const myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);

  // TODO: Auth here
  // TODO: Check time last tallied
  // TODO: Tie breaker
  const appService = await getServerAppService();
  await appService.blockchainService.mintTopPostNFT(
    '0xF7218d3b5719DbF8d44091B829b81438A8f5f576',
    ''
  );

  res.status(200).json({ name: 'John Doe' });
}
