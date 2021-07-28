import Post, { ApiPost } from '../../types/Post';

export type GetPostParams = {
  id: string;
};

export type GetPostResult = {
  post: Post;
};

export type GetPostApiResult = Omit<GetPostResult, 'post'> & {
  post: ApiPost;
};
