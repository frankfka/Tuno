import Post from '../../types/Post';
import User from '../../types/User';
import { MongoosePostData, MongoosePostDocument } from './models/MongoosePost';
import { MongooseUserData, MongooseUserDocument } from './models/MongooseUser';

export const convertPostDocumentToPost = (
  postDocument: MongoosePostDocument
): Post => {
  const documentObj = postDocument.toObject<MongoosePostData>();
  return {
    ...documentObj,
    id: postDocument.id,
  };
};

export const convertUserDocumentToUser = (
  userDocument: MongooseUserDocument
): User => {
  const documentObj = userDocument.toObject<MongooseUserData>();
  return {
    ...documentObj,
    id: userDocument.id,
  };
};
