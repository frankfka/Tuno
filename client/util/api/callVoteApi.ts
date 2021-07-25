import EndpointResult from '../../../types/EndpointResult';
import VoteForPost from '../../../types/VoteForPost';
import createPostFetchInit from '../createPostFetchInit';

const callVoteApi = async (
  postId: string,
  vote?: VoteForPost
): Promise<EndpointResult<void>> => {
  const voteWeight = vote != null ? (vote === 'up' ? 1 : -1) : 0;

  const fetchResp = await fetch(
    `/api/posts/vote`,
    createPostFetchInit({
      body: {
        postId,
        voteWeight,
      },
    })
  );

  return fetchResp.json();
};

export default callVoteApi;
