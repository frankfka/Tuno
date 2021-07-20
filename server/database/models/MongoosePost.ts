import mongoose, { Document, Model, Schema } from 'mongoose';
import Post from '../../../types/Post';

export type MongoosePostData = Post;

export type MongoosePostModel = Model<MongoosePostData>;

export type MongoosePostDocument = Document<MongoosePostData>;

const PostSchema = new Schema<MongoosePostData>({
  createdAt: { type: Schema.Types.Date, required: true, default: Date.now },
  title: { type: Schema.Types.String, required: false },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  contentType: { type: Schema.Types.String, required: true },
  source: {
    type: { type: Schema.Types.String, required: true },
    value: { type: Schema.Types.String, required: true },
  },
  voteScore: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
});

const MongoosePost: MongoosePostModel =
  mongoose.models.Post || mongoose.model<MongoosePostData>('Post', PostSchema);

export default MongoosePost;
