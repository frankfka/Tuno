import MintTransactionResult from '../server/blockchain/MintTransactionResult';
import IpfsAwardMetadata from '../server/ipfs/IpfsAwardMetadata';

export default interface Award {
  id: string;
  createdAt: Date;
  // Refs to MongoDB IDs
  refs: {
    author: string;
    post: string;
  };
  // Transaction result for minting the token
  tokenData: MintTransactionResult;
  // Saved IPFS metadata
  ipfsMetadata: IpfsAwardMetadata;
}
