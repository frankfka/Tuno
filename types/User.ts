import { SafeUserWeb3Account } from './UserWeb3Account';
import Vote from './Vote';

export default interface User {
  id: string;
  email?: string;
  createdAt: Date;

  /*
  TODO: all of these can be optional
  profile: {
    profileImageUrl (ipfs!)
    username:
  }

   */
  web3?: SafeUserWeb3Account; // Don't expose the full account details

  // Votes
  lastVotedAt: Date; // Indicates whether we should wipe votes
  votes: Vote[];
}
