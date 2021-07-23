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
  // Votes
  lastVotedAt: Date; // Indicates whether we should wipe votes
  votes: Vote[];
}
