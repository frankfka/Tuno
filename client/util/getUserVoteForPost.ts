import Post from '../../types/Post';
import User from '../../types/User';
import VoteForPost from '../../types/VoteForPost';

const getUserVoteForPost = (
  post: Post,
  user: User
): VoteForPost | undefined => {
  const userVote = user.votes.find((v) => v.post === post.id);

  if (userVote == null) {
    return;
  }

  return userVote.weight > 0 ? 'up' : 'down';
};

export default getUserVoteForPost;
