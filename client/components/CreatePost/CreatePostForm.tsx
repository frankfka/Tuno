import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { FormikHelpers, FormikState } from 'formik/dist/types';
import React from 'react';
import { Form, FormikProps, Formik, useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import { CreatePostResult } from '../../../server/types/CreatePost';
import EndpointResult from '../../../types/EndpointResult';
import PostContent from '../../../types/PostContent';
import getLinkContentInfo from '../../../util/getLinkContentInfo';
import createPostFetchInit from '../../util/createPostFetchInit';
import FormikFileUpload, {
  FileUploadErrorMessage,
} from '../common/Input/FormikFileUpload';
import FormikTextField from '../common/Input/FormikTextField';

type CreatePostFormProps = {
  onCreate: (postId: string) => void;
};

const useStyles = makeStyles((theme) => ({
  fullWidthGridItem: {
    width: '100%',
  },
  dividerGridItem: {
    width: '60%',
  },
}));

const MAX_TITLE_LENGTH = 100;
const MAX_FILE_SIZE = 10000000; // 10 MB

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Please enter a title')
    .max(MAX_TITLE_LENGTH, 'Title should be under 140 characters'),
  // Content link, required when there is no file
  contentLink: yup.string().when('file', {
    is: (file: File) => file == null,
    then: yup.string().required('Please specify a link or upload a file.'),
    otherwise: yup.string(),
  }),
  // File upload
  file: yup
    .mixed()
    .test(
      'fileSize',
      FileUploadErrorMessage.TOO_LARGE,
      (value: File | undefined) =>
        value == null || (value && value.size <= MAX_FILE_SIZE)
    )
    .test(
      'fileFormat',
      FileUploadErrorMessage.UNSUPPORTED_FILE_TYPE,
      (value: File | undefined) =>
        value == null ||
        value.type.startsWith('image/') ||
        value.type.startsWith('video/')
    ),
});

type FormValues = yup.InferType<typeof validationSchema>;

const CreatePostFormContentTypeDivider: React.FC = () => {
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs>
        <Divider />
      </Grid>

      <Grid item>
        <span>Or</span>
      </Grid>

      <Grid item xs>
        <Divider />
      </Grid>
    </Grid>
  );
};

const CreatePostFormLinkHelperText: React.FC = () => {
  return (
    <Typography variant="caption">
      A URL,{' '}
      <Link
        href="https://unstoppabledomains.com/"
        target="_blank"
        color="secondary"
      >
        Unstoppable Domain link
      </Link>
      , or{' '}
      <Link href="https://ipfs.io/" target="_blank" color="secondary">
        IPFS hash
      </Link>
      .
    </Typography>
  );
};

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
        {/*Title*/}
        <Grid item className={classes.fullWidthGridItem}>
          <FormikTextField
            fullWidth
            name="title"
            label="Post Title"
            variant="outlined"
            helperText={`${
              MAX_TITLE_LENGTH - props.values.title.length
            } characters left`}
          />
        </Grid>

        {/*Content section*/}
        <Grid item className={classes.fullWidthGridItem}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography variant="subtitle1">Post Content</Typography>
            </Grid>
            <Grid item className={classes.fullWidthGridItem}>
              <FormikTextField
                fullWidth
                name="contentLink"
                label="Content Link"
                variant="outlined"
                helperText={<CreatePostFormLinkHelperText />}
              />
            </Grid>

            <Grid item className={classes.dividerGridItem}>
              <CreatePostFormContentTypeDivider />
            </Grid>

            <Grid item>
              <FormikFileUpload
                name="file"
                allowedInputFileType="image/*,video/*"
                helperText="An image or video up to 10mb."
                maxFileSize={MAX_FILE_SIZE}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item className={classes.fullWidthGridItem}>
          <Box mt={2}>
            <Button
              fullWidth
              color="secondary"
              variant="contained"
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="secondary" />
              ) : (
                'Create'
              )}
            </Button>
          </Box>
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
    let postContent: PostContent;

    if (values.contentLink) {
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

      postContent = {
        title: values.title,
        ...linkContentInfo,
      };
    } else if (values.file != null) {
      // Handle file upload
      console.log('UPLOAD FILE');
      helpers.setSubmitting(false);
      return;
    } else {
      // Error case - no content
      helpers.setSubmitting(false);
      helpers.setErrors({
        // TODO use a global error
        contentLink: 'Please specify a link or upload a file.',
      });
      return;
    }

    // Send request to server
    // TODO extract into helper
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
    } else {
      // TODO: set error
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        title: '',
        contentLink: '',
        file: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => <CreatePostFormContent {...props} />}
    </Formik>
  );
};

export default CreatePostForm;
