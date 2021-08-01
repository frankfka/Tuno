import { Web3Storage } from 'web3.storage';
import { getCid } from '../../util/cidUtils';

// Uploads a file to IPFS using nft.storage
export const clientUploadToIpfs = async (file: File): Promise<string> => {
  const storageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;

  console.log(storageToken);
  console.log(file);

  if (storageToken == null) {
    throw Error('Web3 Storage token not defined');
  }
  const storageClient = new Web3Storage({
    token: storageToken,
  });
  const cid = await storageClient.put([file]);

  console.log(cid);

  return getCid(cid + '/' + file.name); // The image property is prefixed with ipfs://
};
