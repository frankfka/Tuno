import type { NextApiRequest, NextApiResponse } from 'next';
import getRequestUser from '../../../server/reqHandlerUtils/getRequestUser';
import { getServerAppService } from '../../../server/serverAppService';
import {
  UpdateUserProfileParams,
  UpdateUserProfileResult,
  UserProfileUsernameError,
} from '../../../server/types/UpdateUserProfile';
import EndpointResult from '../../../types/EndpointResult';
import executeAsyncForResult from '../../../util/executeAsyncForResult';
import resultToEndpointResult from '../../../util/resultToEndpointResult';

// Base validation result, can extract this into a type later
export type UpdateProfileEndpointResult =
  EndpointResult<UpdateUserProfileResult>;

const getRequestParams = (reqBody: any): UpdateUserProfileParams => {
  const profile = {
    username: reqBody.profile?.username,
  };

  return {
    save: reqBody.save ?? false,
    profile,
  };
};

// Validates desired profile update
export default async function profile(
  req: NextApiRequest,
  res: NextApiResponse<UpdateProfileEndpointResult>
) {
  if (req.method !== 'POST') {
    res.status(400).json({
      error: 'Invalid method',
    });
    return;
  }

  const appService = await getServerAppService();

  const result = await executeAsyncForResult(
    async (): Promise<UpdateUserProfileResult> => {
      const user = await getRequestUser(req, appService);

      if (user == null) {
        throw Error('No user associated with request');
      }

      const reqParams = getRequestParams(req.body);

      return appService.updateProfile(reqParams, user);
    }
  );

  res.status(200).json(resultToEndpointResult(result));
}
