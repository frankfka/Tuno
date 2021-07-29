import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import { Form, FormikProps } from 'formik';
import React from 'react';
import { ApiUser } from '../../../../types/User';
import FormikTextField from '../../../components/common/Input/FormikTextField';
import { UserProfileFormValues } from './GeneralSectionFormSchema';

const useStyles = makeStyles((theme: Theme) => ({}));

type FormContentProps = {
  user: ApiUser;
  formikProps: FormikProps<UserProfileFormValues>;
};

const GeneralSectionFormContent: React.FC<FormContentProps> = ({
  user,
  formikProps,
}) => {
  const classes = useStyles();

  const valuesHaveChanged = formikProps.dirty;

  const isFormValid = formikProps.isValid;
  const isLoading = formikProps.isSubmitting;

  return (
    <Form>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {/*Email*/}
        {/*TODO: Allow saving email if undefined?*/}
        <Grid item>
          <FormikTextField
            fullWidth
            name="email"
            disabled
            label="Email"
            variant="outlined"
            value={user.email}
          />
        </Grid>

        {/*Username*/}
        <Grid item>
          <FormikTextField
            fullWidth
            name="username"
            label="Username"
            variant="outlined"
            helperText="Public Username (Optional)"
          />
        </Grid>

        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            type="submit"
            disabled={!isFormValid || isLoading || !valuesHaveChanged}
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export default GeneralSectionFormContent;
