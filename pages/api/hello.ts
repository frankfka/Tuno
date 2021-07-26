import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const appService = await getServerAppService();
  const result = await appService.ipfsService.saveAwardMetadata('testfile', {
    authorEmail: 'testemail@gmail.com',
    createdAt: new Date(),
    postSource: 'someSource',
    voteScore: 0,
  });
  res.status(200).json(result);
}
