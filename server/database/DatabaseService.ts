import {
  FilterQuery,
  Model,
  Mongoose,
  QueryWithHelpers,
  Schema,
} from 'mongoose';
import { remove } from 'lodash';
import GlobalState from '../../types/GlobalState';
import PostContent from '../../types/PostContent';
import TallyData from '../../types/TallyData';
import { CreateVoteParams } from '../../types/Vote';
import getLastTallyTime from '../../util/getLastTallyTime';
import UserAuthData from '../auth/UserAuthData';
import getMongooseConnection from './getMongooseConnection';
import MongooseGlobalState, {
  MongooseGlobalStateData,
  MongooseGlobalStateDocument,
} from './models/MongooseGlobalState';
import MongoosePost, { MongoosePostDocument } from './models/MongoosePost';
import MongooseUser, {
  MongooseUserData,
  MongooseUserDocument,
} from './models/MongooseUser';

export interface DatabaseService {
  init(): Promise<void>;

  // Global
  recordTally(tally: TallyData): Promise<void>;
  getGlobalStateData(): Promise<MongooseGlobalStateData>;

  // Posts
  createPost(
    content: PostContent,
    authorId: string
  ): Promise<MongoosePostDocument>;
  getPosts(
    filterBy?: FilterQuery<MongoosePostDocument>,
    sortBy?: any
  ): Promise<MongoosePostDocument[]>;
  voteOnPost(userId: string, vote: CreateVoteParams): Promise<void>;

  // Tallying

  // Users
  createUser(authData: UserAuthData): Promise<MongooseUserDocument>;
  getUser(authIdentifier: string): Promise<MongooseUserDocument | null>;
}

export default class DatabaseServiceImpl implements DatabaseService {
  private mongoose!: Mongoose;

  private cachedGlobalStateData!: MongooseGlobalStateData;

  async init() {
    this.mongoose = await getMongooseConnection();
    this.cachedGlobalStateData = (await this.getGlobalState()).toObject();
  }

  /*
  Globals
   */

  async recordTally(tally: TallyData) {
    const globalStateDoc = await this.getGlobalState();
    globalStateDoc.tallies.unshift(tally);
    await globalStateDoc.save();

    this.cachedGlobalStateData = globalStateDoc.toObject();
  }

  async getGlobalStateData(): Promise<MongooseGlobalStateData> {
    return this.cachedGlobalStateData;
  }

  private async getGlobalState(): Promise<
    MongooseGlobalStateDocument & MongooseGlobalStateData
  > {
    const globalStateDocument = await MongooseGlobalState.findOne().exec();
    if (globalStateDocument == null) {
      throw Error('Global state document does not exist');
    }

    return globalStateDocument;
  }

  /*
  Posts
   */

  async createPost(
    content: PostContent,
    authorId: string
  ): Promise<MongoosePostDocument> {
    return MongoosePost.create({
      ...content,
      author: authorId,
    });
  }

  // TODO: we need separate types for populated / non populated
  async getPosts(
    filter?: FilterQuery<MongoosePostDocument>,
    sort?: any
  ): Promise<MongoosePostDocument[]> {
    return (
      MongoosePost.find(filter || {})
        .sort(sort)
        // .populate('author')
        .exec()
    );
  }

  // Adds a vote for the given user and post.
  // Throws if the user has exceeded maximum daily votes, or if the user/vote does not exist
  async voteOnPost(userId: string, vote: CreateVoteParams) {
    console.log('Executing vote on post', userId, 'Vote:', vote);

    await this.mongoose.connection.transaction(async (session) => {
      // Get the user associated with the post
      const mongooseUser = await MongooseUser.findById(
        userId,
        {},
        { session }
      ).slice('votes', -this.cachedGlobalStateData.voteLimit);

      if (mongooseUser == null) {
        throw Error('User does not exist');
      }

      if (
        vote.weight !== 0 &&
        mongooseUser.votes.length > 0 &&
        mongooseUser.votes[0].createdAt >
          getLastTallyTime(this.cachedGlobalStateData.tallies)
      ) {
        // User exceeded max votes
        throw Error('User exceeded max daily votes');
      }

      // Now get the post
      const mongoosePost = await MongoosePost.findById(
        vote.post,
        {},
        { session }
      );

      if (mongoosePost == null) {
        throw Error('Post does not exist');
      }

      let scoreUpdate = vote.weight;

      // Update array of user votes, make a copy of the existing votes, modify it, and then set it on the mongoose object
      const userVotes = mongooseUser.toObject().votes;

      // Remove any existing votes for the post
      const existingVotesForPost = remove(
        userVotes,
        (existingVote) => existingVote.post == vote.post
      );
      existingVotesForPost.forEach((v) => (scoreUpdate -= v.weight));

      // If the vote is valid (i.e. not 0, which indicates a deletion, push the new vote)
      if (vote.weight !== 0) {
        userVotes.push({
          ...vote,
          createdAt: new Date(),
        });
      }

      mongooseUser.votes = userVotes;

      // Update post score
      mongoosePost.voteScore += scoreUpdate;

      // Save
      await mongooseUser.save({ session });
      await mongoosePost.save({ session });
    });
  }

  async createUser(authData: UserAuthData): Promise<MongooseUserDocument> {
    return MongooseUser.create({
      email: authData.email,
      auth: {
        authIdentifier: authData.authIdentifier,
        email: authData.email,
      },
    });
  }

  async getUser(authIdentifier: string): Promise<MongooseUserDocument | null> {
    return (
      MongooseUser.findOne({
        'auth.authIdentifier': authIdentifier,
      })
        // Limit to the maximum of today's votes
        .slice('votes', -this.cachedGlobalStateData.voteLimit)
        .exec()
    );
  }
}
