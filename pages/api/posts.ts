import type { NextApiRequest, NextApiResponse } from 'next'
import {getServerAppService} from "../../server/services/serverAppService";
import {convertPostDocumentToPost} from "../../server/services/database/converters";
import Post from "../../types/Post";

type Data = {
  posts: Post[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getServerAppService();
  const posts = (await appService.databaseService.getPosts()).map(convertPostDocumentToPost);
  res.status(200).json({ posts })
}
