import Post, { ApiPost } from '../../types/Post';

export type GetPostsParams = {
  tallyIndex: number;
  minVoteScore?: number;
  // offset?: number,
  // limit?: number,
};

export type GetPostsResult = {
  hasMoreTallies: boolean;
  hasMorePostsForTally: boolean;
  posts: Post[];
};

export type GetPostsApiResult = Omit<GetPostsResult, 'posts'> & {
  posts: ApiPost[];
};
