import mongoose, { Mongoose } from 'mongoose';

async function getMongooseConnection(): Promise<Mongoose> {
  const mongooseConnectionStr = process.env.MONGODB_URI;

  if (!mongooseConnectionStr) {
    throw Error('MongoDB URI is not defined');
  }

  return await mongoose.connect(mongooseConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

export default getMongooseConnection;
