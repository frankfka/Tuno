import { UpdateProfileEndpointResult } from '../../../pages/api/user/profile';
import { UpdateUserProfileParams } from '../../../server/types/UpdateUserProfile';
import createPostFetchInit from '../createPostFetchInit';
import jsonFetcher from '../jsonFetcher';

const callUserProfileUpdateApi = async (
  params: UpdateUserProfileParams
): Promise<UpdateProfileEndpointResult> => {
  return await jsonFetcher(
    '/api/user/profile',
    createPostFetchInit({
      body: params,
    })
  );
};

export default callUserProfileUpdateApi;
