import { CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { FormikHelpers, FormikState } from 'formik/dist/types';
import React from 'react';
import ReactDOM from 'react-dom';
import { useField, Form, FormikProps, Formik, useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { CreatePostResult } from '../../../server/types/CreatePost';
import EndpointResult from '../../../types/EndpointResult';
import PostContent from '../../../types/PostContent';
import getLinkContentInfo from '../../../util/getLinkContentInfo';
import createPostFetchInit from '../../util/createPostFetchInit';
import FormikTextField from '../common/Input/FormikTextField';

type CreatePostFormProps = {
  onCreate: (postId: string) => void;
};

const useStyles = makeStyles((theme) => ({
  gridItem: {
    width: '100%',
  },
}));

const validationSchema = yup.object({
  title: yup.string().required('Please enter a title'),
  contentLink: yup.string().required('Please enter a link.'),
});

type FormValues = yup.InferType<typeof validationSchema>;

const CreatePostFormContent = (props: FormikProps<FormValues>) => {
  const classes = useStyles();

  const isFormValid = props.isValid;
  const isLoading = props.isSubmitting;

  return (
    <Form>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item className={classes.gridItem}>
          <FormikTextField
            fullWidth
            name="title"
            label="Post Title"
            variant="outlined"
          />
        </Grid>

        <Grid item className={classes.gridItem}>
          <FormikTextField
            fullWidth
            name="contentLink"
            label="Content Link"
            variant="outlined"
            helperText="A URL or an IPFS hash."
          />
        </Grid>

        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onCreate }) => {
  const onSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    // Attempt to get link content
    const linkContentInfo = await getLinkContentInfo(values.contentLink);

    // Error case
    if (!linkContentInfo) {
      helpers.setSubmitting(false);
      helpers.setErrors({
        contentLink: 'Please enter a valid link',
      });

      return;
    }

    // Send request to server
    const postContent: PostContent = {
      title: values.title,
      ...linkContentInfo,
    };

    const createResponse = await fetch(
      '/api/posts/create',
      createPostFetchInit({
        body: postContent,
      })
    );

    helpers.setSubmitting(false);

    const createResponseJson =
      (await createResponse.json()) as EndpointResult<CreatePostResult>;

    if (createResponseJson.data?.id) {
      // Success
      onCreate(createResponseJson.data.id);
      // TODO: Need to invalidate posts
    } else {
      // TODO: set error
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        title: '',
        contentLink: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => <CreatePostFormContent {...props} />}
    </Formik>
  );
};

export default CreatePostForm;