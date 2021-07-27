import PostContent from './PostContent';

export default interface Post extends PostContent {
  id: string;
  createdAt: Date;
  author: string;
  voteScore: number;
  awards: string[];
}

export type ApiPost = Omit<Post, 'createdAt'> & {
  createdAt: string;
};
