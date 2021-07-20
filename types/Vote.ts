export default interface Vote {
  createdAt: Date;
  post: string;
  weight: number;
}

export type CreateVoteParams = Omit<Vote, 'createdAt'>; // Default creation date is now()
