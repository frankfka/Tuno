import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerAppService } from '../../../server/serverAppService';
import {
  ApiGetAwardResult,
  GetAwardParams,
  GetAwardResult,
} from '../../../server/types/GetAward';
import { GetPostsByAuthorParams } from '../../../server/types/GetPosts';
import EndpointResult from '../../../types/EndpointResult';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

export type ApiAwardEndpointResult = EndpointResult<ApiGetAwardResult>;

const parseGetAwardRequest = (queryParams: any): GetAwardParams | undefined => {
  return queryParams.id != null
    ? {
        id: queryParams.id,
      }
    : undefined;
};

export default async function award(
  req: NextApiRequest,
  res: NextApiResponse<EndpointResult<GetAwardResult>>
) {
  const getAwardRequest = parseGetAwardRequest(req.query);

  if (getAwardRequest == null) {
    res.status(400).json({
      error: 'Invalid query',
    });
    return;
  }

  const appService = await getServerAppService();

  const awardResult = await executeAsyncForResult(async () => {
    return appService.getAward(getAwardRequest);
  });

  res.status(200).json(resultToEndpointResult(awardResult));
}
