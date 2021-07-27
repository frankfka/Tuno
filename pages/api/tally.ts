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

  const tallySecretAuthKey = process.env.TALLY_SECRET_KEY;

  if (tallySecretAuthKey == null) {
    res
      .status(500)
      .json({ error: 'Authorization key not in environment vars' });
    return;
  }

  const authHeader = req.headers.authorization ?? '';

  if (authHeader != tallySecretAuthKey) {
    res.status(404).json({ error: 'Incorrect authorization' });
    return;
  }

  res.status(200).json({});
  return;

  const appService = await getServerAppService();

  await appService.tallyTopPost();

  res.status(200).json({});
}
