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
  const topPosts = await appService.databaseService.getPosts(
    {
      voteScore: {
        $gt: 0,
      },
      createdAt: {
        $gte: myDate,
      },
    },
    {
      voteScore: 'desc',
    }
  );

  console.log(topPosts);
  if (topPosts.length > 0) {
    // TODO: Mint first post!
  }

  res.status(200).json({ name: 'John Doe' });
}
