import GlobalState, { ApiGlobalState } from '../../types/GlobalState';
import User, { ApiUser } from '../../types/User';
import Vote, { ApiVote } from '../../types/Vote';
import getApiSafeDate from '../../util/getApiSafeDate';
import getLastTallyTime from '../../util/getLastTallyTime';

const getUserNumRemainingVotes = (
  user?: ApiUser,
  globalState?: ApiGlobalState
): number => {
  if (user == null || globalState == null) {
    return 0;
  }
  const lastTallyTime = getLastTallyTime(globalState.tallies);
  const numUserVotesForCurrentTally = user.votes.filter(
    (v) => getApiSafeDate(v.createdAt) > lastTallyTime
  ).length;
  const diff = globalState.voteLimit - numUserVotesForCurrentTally;

  return diff > 0 ? diff : 0;
};

export default getUserNumRemainingVotes;
