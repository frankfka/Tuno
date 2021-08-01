import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FormikHelpers, FormikState } from 'formik/dist/types';
import React, { useState } from 'react';
import { Form, FormikProps, Formik, useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import PostContent from '../../../types/PostContent';
import PostContentType from '../../../types/PostContentType';
import getLinkContentInfo from '../../../util/getLinkContentInfo';
import callCreatePostApi from '../../util/api/callCreatePostApi';
import { clientUploadToIpfs } from '../../util/clientUploadToIpfs';
import FormikFileUpload from '../common/Input/FormikFileUpload';
import FormikTextField from '../common/Input/FormikTextField';
import {
  CreatePostFormValues,
  CREATE_POST_MAX_FILE_SIZE,
  CREATE_POST_MAX_TITLE_LENGTH,
  createPostValidationSchema,
} from './createPostFormConstants';

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

const CreatePostFormContent = (props: FormikProps<CreatePostFormValues>) => {
  const classes = useStyles();

  const isFormValid = props.isValid;
  const isLoading = props.isSubmitting;

  const disableSubmitButton = isLoading || !(isFormValid && props.dirty);

  return (
    <Form>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {/*Title*/}
        <Grid item className={classes.fullWidthGridItem}>
          <FormikTextField
            fullWidth
            name="title"
            label="Post Title"
            variant="outlined"
            helperText={`${
              CREATE_POST_MAX_TITLE_LENGTH - props.values.title.length
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
            spacing={1}
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
                maxFileSize={CREATE_POST_MAX_FILE_SIZE}
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
              disabled={disableSubmitButton}
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
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string>();
  const closeGlobalErrorAlert = () => setGlobalErrorMessage(undefined);

  const onSubmit = async (
    values: CreatePostFormValues,
    helpers: FormikHelpers<CreatePostFormValues>
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
      let contentType: PostContentType = 'other';
      if (values.file.type.startsWith('image')) {
        contentType = 'img';
      } else if (values.file.type.startsWith('video')) {
        contentType = 'av';
      }

      try {
        const uploadedFileCid = await clientUploadToIpfs(values.file);

        postContent = {
          title: values.title,
          contentType,
          source: {
            type: 'ipfs',
            value: uploadedFileCid,
          },
        };
      } catch (err) {
        // Error case, invalid upload
        console.error('Error uploading file to nft.storage', err);
        helpers.setSubmitting(false);
        setGlobalErrorMessage(
          "Your file couldn't be uploaded. Please try again."
        );
        return;
      }
    } else {
      // Error case - no content (This shouldn't happen because of yup validation)
      helpers.setSubmitting(false);
      setGlobalErrorMessage('Please specify a link or upload a file.');
      return;
    }

    const createPostResponse = await callCreatePostApi(postContent);
    helpers.setSubmitting(false);

    if (createPostResponse.data?.id) {
      // Success
      onCreate(createPostResponse.data.id);
    } else {
      setGlobalErrorMessage("Your post couldn't be created. Please try again");
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/*Global error message*/}
      {globalErrorMessage && (
        <Grid item>
          <Alert severity="error" onClose={closeGlobalErrorAlert}>
            {globalErrorMessage}
          </Alert>
        </Grid>
      )}

      {/*Form*/}
      <Grid item>
        <Formik<CreatePostFormValues>
          initialValues={{
            title: '',
            contentLink: '',
            file: undefined,
          }}
          validationSchema={createPostValidationSchema}
          onSubmit={onSubmit}
        >
          {/*Form content*/}
          {(props) => <CreatePostFormContent {...props} />}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default CreatePostForm;
