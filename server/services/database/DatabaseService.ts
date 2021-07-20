import {Model, Mongoose} from "mongoose";
import PostContent from "../../../types/PostContent";
import UserAuthData from "../auth/UserAuthData";
import getMongooseConnection from "./getMongooseConnection";
import MongoosePost, {MongoosePostDocument} from "./models/MongoosePost";
import MongooseUser, {MongooseUserDocument} from "./models/MongooseUser";

export interface DatabaseService {
  init(): Promise<void>;
  createPost(content: PostContent): Promise<MongoosePostDocument>
  getPosts(): Promise<MongoosePostDocument[]>
  createUser(authData: UserAuthData): Promise<MongooseUserDocument>
  getUser(authIdentifier: string): Promise<MongooseUserDocument | null>
}

export default class DatabaseServiceImpl implements DatabaseService {

  private mongoose!: Mongoose;
  async init() {
    this.mongoose = await getMongooseConnection();
  }

  async createPost(content: PostContent): Promise<MongoosePostDocument> {
    return MongoosePost.create(content)
  }

  async getPosts(): Promise<MongoosePostDocument[]> {
    return MongoosePost.find({}).sort({
      createdAt: 'desc'
    }).exec();
  }

  async createUser(authData: UserAuthData): Promise<MongooseUserDocument> {
    return MongooseUser.create({
      email: authData.email,
      auth: {
        authIdentifier: authData.authIdentifier,
        email: authData.email
      }
    })
  }

  async getUser(authIdentifier: string): Promise<MongooseUserDocument | null> {
    return MongooseUser.findOne({
      'auth.authIdentifier': authIdentifier,
    }).exec();
  }

}
