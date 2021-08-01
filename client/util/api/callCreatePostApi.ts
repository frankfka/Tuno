import { CreatePostResult } from '../../../server/types/CreatePost';
import EndpointResult from '../../../types/EndpointResult';
import PostContent from '../../../types/PostContent';
import createPostFetchInit from '../createPostFetchInit';

const callCreatePostApi = async (
  postContent: PostContent
): Promise<EndpointResult<CreatePostResult>> => {
  const createResponse = await fetch(
    '/api/posts/create',
    createPostFetchInit({
      body: postContent,
    })
  );

  return createResponse.json();
};

export default callCreatePostApi;
