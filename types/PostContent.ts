import PostContentSource from './PostContentSource';
import PostContentType from './PostContentType';

type PostContent = {
  title: string;
  contentType: PostContentType;
  source: PostContentSource;
};

export default PostContent;
