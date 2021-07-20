import Post from '../../../types/Post';
import User from '../../../types/User';
import { MongoosePostData, MongoosePostDocument } from './models/MongoosePost';
import { MongooseUserData, MongooseUserDocument } from './models/MongooseUser';

export const convertPostDocumentToPost = (
  postDocument: MongoosePostDocument
): Post => {
  const documentObj = postDocument.toObject<MongoosePostData>();
  return {
    contentType: documentObj.contentType,
    createdAt: documentObj.createdAt,
    id: postDocument.id,
    source: documentObj.source,
    title: documentObj.title,
  };
};

export const convertUserDocumentToUser = (
  userDocument: MongooseUserDocument
): User => {
  const documentObj = userDocument.toObject<MongooseUserData>();
  return {
    id: userDocument.id,
    email: documentObj.email,
    createdAt: documentObj.createdAt,
  };
};
