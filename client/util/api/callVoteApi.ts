import EndpointResult from '../../../types/EndpointResult';
import VoteForPost from '../../../types/VoteForPost';
import createPostFetchInit from '../createPostFetchInit';

export const convertVoteForPostToWeight = (vote?: VoteForPost): number => {
  return vote != null ? (vote === 'up' ? 1 : -1) : 0;
};

const callVoteApi = async (
  postId: string,
  vote?: VoteForPost
): Promise<EndpointResult<void>> => {
  const fetchResp = await fetch(
    `/api/posts/vote`,
    createPostFetchInit({
      body: {
        postId,
        voteWeight: convertVoteForPostToWeight(vote),
      },
    })
  );

  return fetchResp.json();
};

export default callVoteApi;
