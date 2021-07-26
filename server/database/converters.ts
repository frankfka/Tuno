import { omit } from 'lodash';
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
  // Remove private key from document
  omit(documentObj, ['web3', 'privateKey']);

  return {
    ...documentObj,
    id: userDocument.id,
  };
};
