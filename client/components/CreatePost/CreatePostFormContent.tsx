import {
  Box,
  CircularProgress,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Form, FormikProps } from 'formik';
import React, { useState } from 'react';
import FormikFileUpload from '../common/Input/FormikFileUpload';
import FormikTextField from '../common/Input/FormikTextField';
import {
  CREATE_POST_MAX_FILE_SIZE,
  CREATE_POST_MAX_TITLE_LENGTH,
  CreatePostFormValues,
} from './createPostFormConstants';
import CreatePostFormContentTypeTabs, {
  ContentTypeTabName,
} from './CreatePostFormContentTypeTabs';
import CreatePostFormLinkHelperText from './CreatePostFormLinkHelperText';

const useStyles = makeStyles((theme) => ({
  fullWidthGridItem: {
    width: '100%',
  },
}));

const CreatePostFormContent = (props: FormikProps<CreatePostFormValues>) => {
  const classes = useStyles();

  const [contentTypeTab, setContentTypeTab] =
    useState<ContentTypeTabName>('Link');

  const isFormValid = props.isValid;
  const isLoading = props.isSubmitting;

  const disableSubmitButton = isLoading || !(isFormValid && props.dirty);

  let postContentSection: React.ReactElement | undefined = undefined;
  switch (contentTypeTab) {
    case 'Link':
      postContentSection = (
        <FormikTextField
          fullWidth
          name="contentLink"
          label="Content Link"
          variant="outlined"
          helperText={<CreatePostFormLinkHelperText />}
        />
      );
      break;
    case 'Text':
      postContentSection = (
        <>
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            paragraph
          >
            Publish a post with{' '}
            <Link
              href="https://www.mkdn.link/"
              color="secondary"
              target="_blank"
            >
              mkdn.link
            </Link>{' '}
            and paste the CID below.
          </Typography>
          <FormikTextField
            fullWidth
            name="contentLink"
            label="Published CID"
            variant="outlined"
          />
        </>
      );
      break;
    case 'Upload':
      postContentSection = (
        <FormikFileUpload
          name="file"
          allowedInputFileType="image/*,video/*"
          helperText="An image or video up to 10mb."
          maxFileSize={CREATE_POST_MAX_FILE_SIZE}
        />
      );
      break;
  }

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
            spacing={3}
          >
            {/*Tabs to select content type*/}
            <Grid item>
              <CreatePostFormContentTypeTabs
                selectedTab={contentTypeTab}
                onTabSelect={setContentTypeTab}
              />
            </Grid>

            {/*Post content input*/}
            <Grid item className={classes.fullWidthGridItem}>
              {postContentSection}
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

export default CreatePostFormContent;
