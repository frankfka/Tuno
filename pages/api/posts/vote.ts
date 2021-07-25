import { NextApiRequest, NextApiResponse } from 'next';
import getRequestSession from '../../../server/reqHandlerUtils/getRequestSession';
import getRequestUser from '../../../server/reqHandlerUtils/getRequestUser';
import sendUnauthorizedResponse from '../../../server/reqHandlerUtils/sendUnauthorizedResponse';
import { getServerAppService } from '../../../server/serverAppService';
import EndpointResult from '../../../types/EndpointResult';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

type ValidVoteRequestBody = {
  postId: string;
  voteWeight: -1 | 0 | 1; // Downvote, remove vote, upvote
};

const validVoteWeights = new Set([-1, 0, 1]);

const isValidRequestBody = (body: any): body is ValidVoteRequestBody => {
  return (
    typeof body.postId === 'string' && validVoteWeights.has(body.voteWeight)
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<void>>
) {
  // Check request
  if (req.method !== 'POST') {
    res.status(400).json({ error: 'Invalid method' });
    return;
  }

  const reqBody = req.body;
  if (!isValidRequestBody(reqBody)) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const appService = await getServerAppService();
  const user = await getRequestUser(req, appService);

  if (user == null) {
    sendUnauthorizedResponse(res);
    return;
  }

  const voteResult = await executeAsyncForResult(async () => {
    return appService.databaseService.voteOnPost(user.id, {
      post: reqBody.postId,
      weight: reqBody.voteWeight,
    });
  });
  res.status(200).json(resultToEndpointResult(voteResult));
}
