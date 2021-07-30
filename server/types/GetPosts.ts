import Post, { ApiPost } from '../../types/Post';

export type GetAllPostsParams = {
  tallyIndex: number;
  minVoteScore?: number;
  // offset?: number,
  // limit?: number,
};

export type GetPostsByAuthorParams = {
  authorId: string;
};

export type GetPostsByIdParams = {
  ids: string[];
};

export type GetPostsResult = {
  hasMore: boolean;
  posts: Post[];
};

export type GetPostsApiResult = Omit<GetPostsResult, 'posts'> & {
  posts: ApiPost[];
};
