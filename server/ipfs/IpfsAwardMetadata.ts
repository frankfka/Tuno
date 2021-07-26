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
