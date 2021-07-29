import * as yup from 'yup';
import { TestFunction } from 'yup/lib/util/createValidation';
import { UserProfileUsernameError } from '../../../../server/types/UpdateUserProfile';
import callUserProfileUpdateApi from '../../../util/api/callUserProfileUpdateApi';

// TODO validator file
const validateUsername: TestFunction<string | undefined, any> = async (
  value,
  context
) => {
  if (value) {
    const validationResult = await callUserProfileUpdateApi({
      save: false,
      profile: {
        username: value,
      }
    });

    if (validationResult.data?.valid) {
      return true;
    }

    const usernameError = validationResult.data?.validationErrors?.username;
    let errorMessage = 'Something went wrong.';

    switch (usernameError) {
      case UserProfileUsernameError.ALREADY_EXISTS:
        errorMessage = 'This username already exists';
        break;
    }

    return context.createError({
      message: errorMessage,
    });
  }
  return true;
};

export const userProfileValidationSchema = yup.object({
  username: yup
    .string()
    .max(128, 'Maximum 128 characters')
    .test('checkDuplicateUsername', validateUsername),
});

export type UserProfileFormValues = yup.InferType<
  typeof userProfileValidationSchema
>;
