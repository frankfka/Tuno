import Post from '../../types/Post';

export type GetPostsParams = {
  tallyIndex: number;
  minVoteScore?: number;
  // offset?: number,
  // limit?: number,
};

export type GetPostsResult = {
  hasMore: boolean;
  posts: Post[];
};