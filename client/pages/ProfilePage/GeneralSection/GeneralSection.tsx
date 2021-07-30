import {
  Card,
  CircularProgress,
  Grid,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Form, Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import React, { useCallback, useState } from 'react';
import { SWRResponse } from 'swr';
import { ApiUserEndpointResult } from '../../../../pages/api/user';
import User, { ApiUser } from '../../../../types/User';
import callUserProfileUpdateApi from '../../../util/api/callUserProfileUpdateApi';
import GeneralSectionFormContent from './GeneralSectionFormContent';
import {
  UserProfileFormValues,
  userProfileValidationSchema,
} from './GeneralSectionFormSchema';

type Props = {
  user: ApiUser;
  userSwr: SWRResponse<ApiUserEndpointResult, Error>;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4, 4),
  },
}));

type AlertType = 'success' | 'error'; // TODO: Generalize snackbar into hook, using https://github.com/iamhosseindhv/notistack

const GeneralSection: React.FC<Props> = ({ user, userSwr }) => {
  const classes = useStyles();

  // Snackbar states
  const [profileUpdateAlertState, setProfileUpdateAlertState] =
    useState<AlertType>();
  const onCloseAlert = useCallback(
    () => setProfileUpdateAlertState(undefined),
    [setProfileUpdateAlertState]
  );

  // Update profile callback
  const onUpdateProfileFormSubmit = useCallback(
    async (
      values: UserProfileFormValues,
      formikHelpers: FormikHelpers<UserProfileFormValues>
    ) => {
      const updateProfileResult = await callUserProfileUpdateApi({
        profile: values,
        save: true,
      });

      formikHelpers.setSubmitting(false);
      if (updateProfileResult.data?.saved) {
        setProfileUpdateAlertState('success');
        userSwr.mutate();
        formikHelpers.resetForm({
          values,
        });
      } else {
        console.error('Error saving new profile', updateProfileResult);
        setProfileUpdateAlertState('error');
      }
    },
    []
  );

  // TODO: Add crypto information?
  return (
    <Card className={classes.root}>
      {/*Snack bars*/}
      <Snackbar
        open={profileUpdateAlertState === 'success'}
        autoHideDuration={5000}
        onClose={onCloseAlert}
      >
        <Alert onClose={onCloseAlert} severity="success">
          Your profile was updated
        </Alert>
      </Snackbar>
      <Snackbar
        open={profileUpdateAlertState === 'error'}
        autoHideDuration={5000}
        onClose={onCloseAlert}
      >
        <Alert onClose={onCloseAlert} severity="error">
          Something went wrong. Please try again
        </Alert>
      </Snackbar>

      {/*Profile Image*/}

      {/*Profile Form*/}
      <Formik<UserProfileFormValues>
        initialValues={{
          username: user.profile?.username ?? '',
        }}
        // Validate only on blur as we call the API to check usernames
        validateOnChange={false}
        validationSchema={userProfileValidationSchema}
        onSubmit={onUpdateProfileFormSubmit}
      >
        {(formikProps) => (
          <GeneralSectionFormContent user={user} formikProps={formikProps} />
        )}
      </Formik>
    </Card>
  );
};

export default GeneralSection;
