export default interface Vote {
  createdAt: Date;
  post: string;
  weight: number; // 0 Indicates a non-vote, which will delete the vote
}

export type ApiVote = Omit<Vote, 'createdAt'> & {
  createdAt: string;
};

export type CreateVoteParams = Omit<Vote, 'createdAt'>; // Default creation date is now()
