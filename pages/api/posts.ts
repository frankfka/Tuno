import type { NextApiRequest, NextApiResponse } from 'next'
import {getAppService} from "../../services";
import {convertPostDocumentToPost} from "../../services/database/converters";
import Post from "../../types/Post";

type Data = {
  posts: Post[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const appService = await getAppService();
  const posts = (await appService.databaseService.getPosts()).map(convertPostDocumentToPost);
  res.status(200).json({ posts })
}
