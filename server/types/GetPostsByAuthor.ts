import Post, { ApiPost } from '../../types/Post';

export type GetPostsByAuthorParams = {
  authorId: string;
};

export type GetPostsByAuthorResult = {
  posts: Post[];
};

export type GetPostsApiResult = Omit<GetPostsByAuthorResult, 'posts'> & {
  posts: ApiPost[];
};
