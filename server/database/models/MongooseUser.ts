import mongoose, { Document, Model, Schema } from 'mongoose';
import User from '../../../types/User';
import UserWeb3Account from '../../../types/UserWeb3Account';
import UserAuthData from '../../auth/UserAuthData';

export interface MongooseUserData extends User {
  // Add auth information to DB
  auth: UserAuthData;
  // Add full web3 account (not just address)
  web3?: UserWeb3Account;
}

export type MongooseUserModel = Model<MongooseUserData>;

export type MongooseUserDocument = Document<MongooseUserData> &
  MongooseUserData;

const UserSchema = new Schema<MongooseUserData>({
  createdAt: { type: Date, required: true, default: Date.now },
  email: { type: String, required: false },
  // Auth information
  auth: {
    authIdentifier: { type: String, required: true },
    email: { type: String, required: false },
  },
  // Profile metadata
  profile: {
    type: {
      username: {
        type: Schema.Types.String,
        minLength: 1,
      },
    },
  },
  // Votes
  votes: {
    type: [
      {
        createdAt: { type: Date, required: true, default: Date.now },
        post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
        weight: { type: Schema.Types.Number, required: true },
      },
    ],
    required: true,
    default: [],
  },
  // Web 3 account
  web3: {
    type: {
      address: {
        type: Schema.Types.String,
        required: true,
      },
      privateKey: {
        type: Schema.Types.String,
        required: true,
      },
    },
    required: false,
  },
});

const MongooseUser: MongooseUserModel =
  mongoose.models.User || mongoose.model<MongooseUserData>('User', UserSchema);

export default MongooseUser;
