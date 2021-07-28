import { add, isBefore } from 'date-fns';
import { FilterQuery, Mongoose } from 'mongoose';
import { remove } from 'lodash';
import Award from '../../types/Award';
import PostContent from '../../types/PostContent';
import TallyData from '../../types/TallyData';
import UserWeb3Account from '../../types/UserWeb3Account';
import { CreateVoteParams } from '../../types/Vote';
import getLastTallyTime from '../../util/getLastTallyTime';
import UserAuthData from '../auth/UserAuthData';
import getMongooseConnection from './getMongooseConnection';
import MongooseAward, { MongooseAwardDocument } from './models/MongooseAward';
import MongooseGlobalState, {
  MongooseGlobalStateData,
  MongooseGlobalStateDocument,
} from './models/MongooseGlobalState';
import MongoosePost, { MongoosePostDocument } from './models/MongoosePost';
import MongooseUser, { MongooseUserDocument } from './models/MongooseUser';

export interface DatabaseService {
  init(): Promise<void>;

  // Global
  getGlobalStateData(): Promise<MongooseGlobalStateData>;

  // Posts
  createPost(
    content: PostContent,
    authorId: string
  ): Promise<MongoosePostDocument>;
  getPostById(id: string): Promise<MongoosePostDocument | null>;
  getPosts(
    filterBy?: FilterQuery<MongoosePostDocument>,
    sortBy?: any
  ): Promise<MongoosePostDocument[]>;
  voteOnPost(userId: string, vote: CreateVoteParams): Promise<void>;
  awardPost(postId: string, awardId: string): Promise<void>;

  // Tallying
  recordTally(tally: TallyData): Promise<void>;
  getAward(id: string): Promise<MongooseAwardDocument | null>;
  saveAward(awardData: Omit<Award, 'id'>): Promise<MongooseAwardDocument>;

  // Users
  createUser(authData: UserAuthData): Promise<MongooseUserDocument>;
  getUserByAuthId(authIdentifier: string): Promise<MongooseUserDocument | null>;
  getUserById(id: string): Promise<MongooseUserDocument | null>;
  saveWeb3AccountForUser(
    id: string,
    web3Account: UserWeb3Account
  ): Promise<void>;
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

    // TODO: Mocking next tally time here for now
    let nextTallyTime = new Date(
      globalStateDocument.nextTallyTime ?? new Date()
    );
    if (isBefore(nextTallyTime, new Date())) {
      // Update next tally to be a day from the prev
      nextTallyTime = add(nextTallyTime, { days: 1 });
      globalStateDocument.nextTallyTime = nextTallyTime;
      await globalStateDocument.save();
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

  async getPostById(id: string): Promise<MongoosePostDocument | null> {
    return MongoosePost.findById(id).exec();
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
      ).slice('votes', -this.cachedGlobalStateData.voteLimit); // First vote here is the earliest

      if (mongooseUser == null) {
        throw Error('User does not exist');
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

      let scoreUpdate = 0;

      // Update array of user votes, make a copy of the existing votes, modify it, and then set it on the mongoose object
      const userVotes = Array.from(mongooseUser.votes);

      // Remove any existing votes for the post
      const existingVotesForPost = remove(
        userVotes,
        (existingVote) => existingVote.post == vote.post
      );
      existingVotesForPost.forEach((v) => (scoreUpdate -= v.weight));

      // If the vote is valid (i.e. not 0, which indicates a deletion, push the new vote)
      if (vote.weight !== 0) {
        if (
          userVotes.length === this.cachedGlobalStateData.voteLimit &&
          // We can just check the vote time, because historical posts can't be voted on
          userVotes[0].createdAt >
            getLastTallyTime(this.cachedGlobalStateData.tallies)
        ) {
          // User exceeded max votes
          console.error('User exceeded max votes, not counting this vote');
        } else {
          userVotes.push({
            ...vote,
            createdAt: new Date(),
          });
          scoreUpdate += vote.weight;
        }
      }

      mongooseUser.votes = userVotes;

      // Update post score
      mongoosePost.voteScore += scoreUpdate;

      // Save
      await mongooseUser.save({ session });
      await mongoosePost.save({ session });
    });
  }

  async awardPost(postId: string, awardId: string): Promise<void> {
    await MongoosePost.findByIdAndUpdate(postId, {
      $push: {
        awards: awardId,
      },
    });
  }

  /*
  Tallying
   */

  async recordTally(tally: TallyData) {
    const globalStateDoc = await this.getGlobalState();
    globalStateDoc.tallies.unshift(tally);
    await globalStateDoc.save();

    this.cachedGlobalStateData = globalStateDoc.toObject();
  }

  async saveAward(
    awardData: Omit<Award, 'id'>
  ): Promise<MongooseAwardDocument> {
    return MongooseAward.create(awardData);
  }

  async getAward(id: string): Promise<MongooseAwardDocument | null> {
    return MongooseAward.findById(id).exec();
  }

  /*
  Users
   */

  async createUser(authData: UserAuthData): Promise<MongooseUserDocument> {
    return MongooseUser.create({
      email: authData.email,
      auth: {
        authIdentifier: authData.authIdentifier,
        email: authData.email,
      },
    });
  }

  async getUserByAuthId(
    authIdentifier: string
  ): Promise<MongooseUserDocument | null> {
    return (
      MongooseUser.findOne({
        'auth.authIdentifier': authIdentifier,
      })
        // Limit to the maximum of today's votes
        .slice('votes', -this.cachedGlobalStateData.voteLimit)
        .exec()
    );
  }

  async getUserById(id: string): Promise<MongooseUserDocument | null> {
    return (
      MongooseUser.findById(id)
        // Limit to the maximum of today's votes
        .slice('votes', -this.cachedGlobalStateData.voteLimit)
        .exec()
    );
  }

  async saveWeb3AccountForUser(
    id: string,
    web3Account: UserWeb3Account
  ): Promise<void> {
    await MongooseUser.findByIdAndUpdate(id, {
      web3: web3Account,
    }).exec();
  }
}
