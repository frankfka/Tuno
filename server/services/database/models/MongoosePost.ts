import mongoose, {Document, Model, Schema} from 'mongoose'
import Post from "../../../../types/Post";

export type MongoosePostData = Post;

export type MongoosePostModel = Model<MongoosePostData>;

export type MongoosePostDocument = Document<MongoosePostData>;

const PostSchema = new Schema<MongoosePostData>({
  createdAt: {type: Date, required: true, default: Date.now},
  title: {type: String, required: false},
  contentType: {type: String, required: true},
  source: {
    type: {type: String, required: true},
    value: {type: String, required: true},
  },
});


const MongoosePost: MongoosePostModel = mongoose.models.Post || mongoose.model<MongoosePostData>('Post', PostSchema);

export default MongoosePost;
