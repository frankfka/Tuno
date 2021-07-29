import { FilterQuery } from 'mongoose';
import { MongoosePostDocument } from '../models/MongoosePost';

type GetPostsFilterParams = {
  authorId?: string;
  startTime?: Date; // Inclusive
  endTime?: Date; // Exclusive
  minVoteScore?: number;
};

export const getPostsFilter = ({
  authorId,
  startTime,
  endTime,
  minVoteScore,
}: GetPostsFilterParams): FilterQuery<MongoosePostDocument> => {
  const filters: FilterQuery<MongoosePostDocument> = {};

  if (authorId != null) {
    filters.author = authorId;
  }

  filters.voteScore = {
    $gte: minVoteScore == null ? -1 : minVoteScore,
  };

  const createdAtFilter: Record<string, Date> = {};
  if (startTime != null) {
    createdAtFilter['$gte'] = startTime;
  }
  if (endTime != null) {
    createdAtFilter['$lt'] = endTime;
  }
  if (Object.keys(createdAtFilter).length > 0) {
    filters.createdAt = createdAtFilter;
  }

  return filters;
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
