import PostContent from './PostContent';

type Post = {
  id: string;
  createdAt: Date;
  author: string;
  voteScore: number;
} & PostContent;

export default Post;
