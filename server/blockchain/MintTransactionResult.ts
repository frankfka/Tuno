export default interface MintTransactionResult {
  tokenId: number;
  transactionHash: string;
  authorAddress: string;
  metadataUri: string;
  chain: 'matic-mumbai';
}
