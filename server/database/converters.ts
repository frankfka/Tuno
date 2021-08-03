import { omit } from 'lodash';
import Award from '../../types/Award';
import GlobalState from '../../types/GlobalState';
import Post from '../../types/Post';
import User from '../../types/User';
import {
  MongooseAwardData,
  MongooseAwardDocument,
} from './models/MongooseAward';
import {
  MongooseGlobalStateData,
  MongooseGlobalStateDocument,
} from './models/MongooseGlobalState';
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

export const convertAwardDocumentToAward = (
  awardDocument: MongooseAwardDocument
): Award => {
  const documentObj = awardDocument.toObject<MongooseAwardData>();

  return {
    ...documentObj,
    id: awardDocument.id,
  };
};

export const convertGlobalStateDocumentToGlobalState = (
  globalStateDocument: MongooseGlobalStateDocument
): GlobalState => {
  const documentObj = globalStateDocument.toObject<MongooseGlobalStateData>();

  return {
    ...documentObj,
  };
};
