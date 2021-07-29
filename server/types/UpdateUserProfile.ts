export enum UserProfileUsernameError {
  ALREADY_EXISTS,
}

// Contains all user profile fields
export type UpdateUserProfileParams = {
  save: boolean; // If false, just do validation
  profile: {
    username?: string;
  };
};

export type UpdateUserProfileErrorsResult = {
  username?: UserProfileUsernameError;
};

export type UpdateUserProfileResult = {
  saved: boolean;
  valid: boolean;
  validationErrors?: UpdateUserProfileErrorsResult;
  saveError?: Error;
};
