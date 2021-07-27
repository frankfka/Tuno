import GlobalState, { ApiGlobalState } from '../../types/GlobalState';
import User from '../../types/User';
import getLastTallyTime from '../../util/getLastTallyTime';

const getUserNumRemainingVotes = (
  user?: User,
  globalState?: ApiGlobalState
): number => {
  if (user == null || globalState == null) {
    return 0;
  }
  const lastTallyTime = getLastTallyTime(globalState.tallies);
  const numUserVotesForCurrentTally = user.votes.filter(
    (v) => v.createdAt > lastTallyTime
  ).length;
  const diff = globalState.voteLimit - numUserVotesForCurrentTally;

  return diff > 0 ? diff : 0;
};

export default getUserNumRemainingVotes;
