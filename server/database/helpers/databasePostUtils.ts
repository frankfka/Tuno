/*
Top Votes
 */

type GetPostsFilterParams = {
  startTime?: Date; // Inclusive
  endTime?: Date; // Exclusive
  minVoteScore?: number;
};

export const getPostsFilter = ({
  startTime,
  endTime,
  minVoteScore,
}: GetPostsFilterParams): any => {
  const voteScoreFilter = {
    $gte: minVoteScore == null ? -1 : minVoteScore,
  };

  const createdAtFilter: Record<string, Date> = {};

  if (startTime != null) {
    createdAtFilter['$gte'] = startTime;
  }
  if (endTime != null) {
    createdAtFilter['$lt'] = endTime;
  }

  return {
    voteScore: voteScoreFilter,
    createdAt: createdAtFilter,
  };
};

type GetPostsSortByParams = {
  voteScore?: 'desc' | 'asc';
  createdAt?: 'desc' | 'asc';
};

export const getPostsSortBy = ({
  voteScore,
  createdAt,
}: GetPostsSortByParams): Record<string, string> => {
  const sortBy: Record<string, string> = {};

  if (voteScore) {
    sortBy['voteScore'] = voteScore;
  }

  if (createdAt) {
    sortBy['createdAt'] = createdAt;
  }

  return sortBy;
};
