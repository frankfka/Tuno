import { Model, Mongoose, Schema } from 'mongoose';
import { remove } from 'lodash';
import PostContent from '../../types/PostContent';
import Vote from '../../types/Vote';
import UserAuthData from '../auth/UserAuthData';
import getMongooseConnection from './getMongooseConnection';
import MongoosePost, { MongoosePostDocument } from './models/MongoosePost';
import MongooseUser, { MongooseUserDocument } from './models/MongooseUser';

export interface DatabaseService {
  init(): Promise<void>;
  createPost(
    content: PostContent,
    authorId: string
  ): Promise<MongoosePostDocument>;
  getPosts(): Promise<MongoosePostDocument[]>;
  voteOnPost(userId: string, vote: Vote): Promise<void>;
  createUser(authData: UserAuthData): Promise<MongooseUserDocument>;
  getUser(authIdentifier: string): Promise<MongooseUserDocument | null>;
}

export default class DatabaseServiceImpl implements DatabaseService {
  private mongoose!: Mongoose;
  async init() {
    this.mongoose = await getMongooseConnection();
  }

  async createPost(
    content: PostContent,
    authorId: string
  ): Promise<MongoosePostDocument> {
    return MongoosePost.create({
      ...content,
      author: authorId,
    });
  }

  async getPosts(): Promise<MongoosePostDocument[]> {
    // TODO: we need separate types for populated / non populated
    return (
      MongoosePost.find({})
        .sort({
          createdAt: 'desc',
        })
        // .populate('author')
        .exec()
    );
  }

  // TODO: First do the below, then we need to figure out a reset mechanism
  // Throws if unsuccessful
  async voteOnPost(userId: string, vote: Vote) {
    console.log('Begin vote on post', userId, 'Vote:', vote);

    await this.mongoose.connection.transaction(async (session) => {
      const mongooseUser = await MongooseUser.findById(userId, {}, { session });
      if (mongooseUser == null) {
        throw Error('User does not exist');
      }

      const mongoosePost = await MongoosePost.findById(
        vote.post,
        {},
        { session }
      );
      if (mongoosePost == null) {
        throw Error('Post does not exist');
      }

      let scoreUpdate = vote.weight;

      // Update user lastVotedAt & current votes
      mongooseUser.lastVotedAt = new Date();

      // To modify arrays, make a copy of the existing votes, modify it, and then set it on the mongoose object
      const userVotes = mongooseUser.toObject().votes;
      const existingVotesForPost = remove(
        userVotes,
        (existingVote) => existingVote.post == vote.post
      );

      existingVotesForPost.forEach((v) => (scoreUpdate -= v.weight));
      userVotes.push(vote);
      mongooseUser.votes = userVotes;

      // Update post score
      mongoosePost.voteScore += scoreUpdate;

      // Save
      await mongooseUser.save({ session });
      await mongoosePost.save({ session });
    });
  }

  async removeVoteOnPost(userId: string, postId: string) {
    // Atomic transaction
    // Update user lastVotedAt & current votes
    // Update post score
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
    return MongooseUser.findOne({
      'auth.authIdentifier': authIdentifier,
    }).exec();
  }
}
