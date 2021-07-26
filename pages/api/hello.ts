import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../server/serverAppService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const appService = await getServerAppService();
  const result = await appService.blockchainService.test();
  // const result = await appService.blockchainService.mintTopPostNFT(
  //   '0xEAe27Ae6412147Ed6d5692Fd91709DaD6dbfc342',
  //   'MetadataURI'
  // );
  res.status(200).json(result);
}
