import * as yup from 'yup';
import { FileUploadErrorMessage } from '../common/Input/FormikFileUpload';

export const CREATE_POST_MAX_TITLE_LENGTH = 100;
export const CREATE_POST_MAX_FILE_SIZE = 10000000; // 10 MB

export const createPostValidationSchema = yup.object({
  title: yup
    .string()
    .required('Please enter a title')
    .max(CREATE_POST_MAX_TITLE_LENGTH, 'Title should be under 140 characters'),
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
        value == null || (value && value.size <= CREATE_POST_MAX_FILE_SIZE)
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

export type CreatePostFormValues = yup.InferType<
  typeof createPostValidationSchema
>;
