import type { NextApiResponse } from 'next';

const sendUnauthorizedResponse = (res: NextApiResponse): void => {
  res.status(401).json({
    error: 'Invalid authentication',
  });
};

export default sendUnauthorizedResponse;
