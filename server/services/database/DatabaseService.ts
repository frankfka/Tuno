import {Model, Mongoose} from "mongoose";
import PostContent from "../../../types/PostContent";
import getMongooseConnection from "./getMongooseConnection";
import MongoosePost, {MongoosePostDocument} from "./models/MongoosePost";

export interface DatabaseService {
  init(): Promise<void>;
  createPost(content: PostContent): Promise<MongoosePostDocument>
  getPosts(): Promise<MongoosePostDocument[]>
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

}
