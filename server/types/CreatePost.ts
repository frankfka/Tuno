import PostContent from '../../types/PostContent';

export type CreatePostParams = {
  content: PostContent;
  authorId: string;
};

export type CreatePostResult = {
  id: string;
};
