import { Grid } from '@material-ui/core';
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
import {
  CreatePostFormValues,
  createPostValidationSchema,
} from './createPostFormConstants';
import CreatePostFormContent from './CreatePostFormContent';

type CreatePostFormProps = {
  onCreate: (postId: string) => void;
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
