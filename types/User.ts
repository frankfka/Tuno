import UserProfile from './UserProfile';
import { SafeUserWeb3Account } from './UserWeb3Account';
import Vote, { ApiVote } from './Vote';

export default interface User {
  id: string;
  email?: string;
  createdAt: Date;

  // Profile metadata
  profile: UserProfile;

  // Cryptocurrency wallet info
  web3?: SafeUserWeb3Account; // Don't expose the full account details

  // Votes
  votes: Vote[];
}

export type ApiUser = Omit<User, 'createdAt' | 'votes'> & {
  createdAt: string;
  votes: ApiVote[];
};
