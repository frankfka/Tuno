import Vote from './Vote';

export default interface User {
  id: string;
  email?: string;
  createdAt: Date;
  // Votes
  lastVotedAt: Date; // Indicates whether we should wipe votes
  votes: Vote[];
}
