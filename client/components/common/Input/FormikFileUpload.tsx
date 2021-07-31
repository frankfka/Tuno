import Button from '@material-ui/core/Button';
import { TypographyTypeMap } from '@material-ui/core/Typography/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { ChangeEvent, FormEventHandler } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import { useField } from 'formik';

type Props = {
  name: string;
  helperText?: string;
  allowedInputFileType?: string;
  maxFileSize?: number;
};

export enum FileUploadErrorMessage {
  TOO_LARGE = 'The selected file is too large.',
  UNSUPPORTED_FILE_TYPE = 'This file type is not supported.',
}

const FormikFileUploadCaption: React.FC<{
  label: string;
  type: 'error' | 'info';
}> = ({ label, type }) => {
  const color: TypographyTypeMap['props']['color'] =
    type === 'error' ? 'error' : undefined;

  return (
    <Typography variant="caption" color={color}>
      {label}
    </Typography>
  );
};

const FormikFileUpload: React.FC<Props> = ({
  name,
  helperText,
  allowedInputFileType,
  maxFileSize,
}) => {
  const [{ value }, meta, helper] = useField<File | undefined>(name);

  const fieldError = meta && meta.error ? meta.error : undefined;

  const caption = fieldError || helperText;
  const captionType = fieldError != null ? 'error' : 'info';

  const onUploadInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files != null && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];

      if (maxFileSize && file.size > maxFileSize) {
        helper.setValue(undefined, false);
        helper.setError(FileUploadErrorMessage.TOO_LARGE);
      } else {
        helper.setValue(e.currentTarget.files[0]);
      }
    } else {
      helper.setValue(undefined);
    }
  };

  const onClearFileClicked = () => {
    helper.setValue(undefined);
  };

  const uploadButtonText = (value == null ? 'Upload' : 'Replace') + ' File';

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      {/*Uploaded file*/}
      {value != null && (
        <Grid item>
          <Typography>
            {value.name}{' '}
            <IconButton
              component="button"
              color="secondary"
              onClick={onClearFileClicked}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Typography>
        </Grid>
      )}
      {/*Upload Button*/}
      <Grid item>
        <Button variant="outlined" color="primary" component="label">
          {uploadButtonText}
          <input
            hidden
            type="file"
            id={name}
            name={name}
            onChange={onUploadInputChange}
            accept={allowedInputFileType}
          />
        </Button>
      </Grid>

      {/*Helper Text*/}
      {caption && (
        <Grid item>
          <FormikFileUploadCaption type={captionType} label={caption} />
        </Grid>
      )}
    </Grid>
  );
};

export default FormikFileUpload;
