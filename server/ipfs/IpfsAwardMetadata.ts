export default interface IpfsAwardMetadata {
  // ERC721 Requirements
  name: string;
  description: string;
  image: string;
  // Additional metadata
  authorAddress: string;
  voteScore: number;
  postSource: string;
  createdAt: Date;
}

export type ApiIpfsAwardMetadata = Omit<IpfsAwardMetadata, 'createdAt'> & {
  createdAt: string;
};
