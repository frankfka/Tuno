import Post from "../../../types/Post";
import {MongoosePostData, MongoosePostDocument} from "./models/MongoosePost";

export const convertPostDocumentToPost = (postDocument: MongoosePostDocument): Post => {
  const documentObj = postDocument.toObject<MongoosePostData>();
  return {
    contentType: documentObj.contentType,
    createdAt: documentObj.createdAt,
    id: postDocument.id,
    source: documentObj.source,
    title: documentObj.title
  }
}
