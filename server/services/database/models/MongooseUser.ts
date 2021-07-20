import mongoose, {Document, Model, Schema} from 'mongoose'
import User from "../../../../types/User";
import UserAuthData from "../../auth/UserAuthData";

export interface MongooseUserData extends User {
  // Add auth information to DB
  auth: UserAuthData,
}

export type MongooseUserModel = Model<MongooseUserData>;

export type MongooseUserDocument = Document<MongooseUserData>;

const UserSchema = new Schema<MongooseUserData>({
  createdAt: {type: Date, required: true, default: Date.now},
  email: {type: String, required: false},
  auth: {
    authIdentifier: {type: String, required: true},
    email: {type: String, required: false},
  },
});


const MongooseUser: MongooseUserModel = mongoose.models.User || mongoose.model<MongooseUserData>('User', UserSchema);

export default MongooseUser;
