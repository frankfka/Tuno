import mongoose, { Document, Model, Schema } from 'mongoose';
import GlobalState from '../../../types/GlobalState';

export type MongooseGlobalStateData = GlobalState;

export type MongooseGlobalStateModel = Model<MongooseGlobalStateData>;

export type MongooseGlobalStateDocument = Document<MongooseGlobalStateData>;

const GlobalStateSchema = new Schema<MongooseGlobalStateData>(
  {
    tallies: {
      type: [
        {
          tallyTime: { type: Schema.Types.Date, required: true },
        },
      ],
      required: true,
      default: [],
    },
    voteLimit: { type: Schema.Types.Number, required: true },
    nextTallyTime: { type: Schema.Types.Date, required: true },
  },
  {
    collection: 'globalState',
  }
);

const MongooseGlobalState: MongooseGlobalStateModel =
  mongoose.models.GlobalState ||
  mongoose.model<MongooseGlobalStateData>('GlobalState', GlobalStateSchema);

export default MongooseGlobalState;
