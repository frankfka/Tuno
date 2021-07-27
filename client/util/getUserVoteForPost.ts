import Post, { ApiPost } from '../../types/Post';
import User from '../../types/User';
import VoteForPost from '../../types/VoteForPost';

const getUserVoteForPost = (
  postId: string,
  user: User | undefined
): VoteForPost | undefined => {
  if (user == null) {
    return;
  }

  const userVote = user.votes.find((v) => v.post === postId);

  if (userVote == null) {
    return;
  }

  return userVote.weight > 0 ? 'up' : 'down';
};

export default getUserVoteForPost;
