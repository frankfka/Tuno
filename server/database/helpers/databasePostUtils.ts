import { FilterQuery } from 'mongoose';
import { MongoosePostDocument } from '../models/MongoosePost';

type GetPostsFilterParams = {
  authorId?: string;
  postIds?: string[];
  startTime?: Date; // Inclusive
  endTime?: Date; // Exclusive
  minVoteScore?: number;
};

export const getPostsFilter = ({
  postIds,
  authorId,
  startTime,
  endTime,
  minVoteScore,
}: GetPostsFilterParams): FilterQuery<MongoosePostDocument> => {
  const filters: FilterQuery<MongoosePostDocument> = {};

  // Post IDs
  if (postIds != null) {
    filters._id = {
      // @ts-ignore
      $in: postIds,
    };
  }

  // Author
  if (authorId != null) {
    filters.author = authorId;
  }

  // Vote score
  if (minVoteScore != null) {
    filters.voteScore = {
      $gte: minVoteScore,
    };
  }

  // Created at
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
