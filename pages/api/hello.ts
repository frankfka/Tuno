// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getServerAppService();
  // await appService.blockchainService.mintTopPostNFT(
  //   '0xF7218d3b5719DbF8d44091B829b81438A8f5f576',
  //   ''
  // );
  // await appService.blockchainService.mintTopPostNFT(
  //   '0xFC8F5155162E959f64E0dA0DbBb9649495fa9Da3',
  //   ''
  // );
  await appService.blockchainService.test();
  res.status(200).json({ name: 'John Doe' });
}
