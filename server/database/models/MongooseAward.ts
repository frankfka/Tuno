import mongoose, { Document, Model, Schema } from 'mongoose';
import Award from '../../../types/Award';

export type MongooseAwardData = Award;

export type MongooseAwardModel = Model<MongooseAwardData>;

export type MongooseAwardDocument = Document<MongooseAwardData> &
  MongooseAwardData;

const AwardSchema = new Schema<MongooseAwardData>({
  // References to other mongoose docs
  refs: {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  createdAt: {
    type: Schema.Types.Date,
    required: true,
    default: Date.now,
  },
  // Blockchain transaction info
  tokenData: {
    tokenId: Schema.Types.Number,
    transactionHash: Schema.Types.String,
    authorAddress: Schema.Types.String,
    metadataUri: Schema.Types.String,
    chain: Schema.Types.String,
  },
  // Metadata saved to IPFS
  ipfsMetadata: {
    name: Schema.Types.String,
    description: Schema.Types.String,
    image: Schema.Types.String,
    authorAddress: Schema.Types.String,
    voteScore: Schema.Types.Number,
    postSource: Schema.Types.String,
    createdAt: Schema.Types.Date,
  },
});

const MongooseAward: MongooseAwardModel =
  mongoose.models.Award ||
  mongoose.model<MongooseAwardData>('Award', AwardSchema);

export default MongooseAward;
