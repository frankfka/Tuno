import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/services/serverAppService';
import PostContent from '../../../types/PostContent';

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getServerAppService();

  const post = await appService.databaseService.createPost(
    req.body as PostContent
  );
  console.log(post);

  res.status(200).json({ name: 'John Doe' });
}
