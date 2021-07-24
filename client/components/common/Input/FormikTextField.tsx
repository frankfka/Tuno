import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';

type Props = {
  name: string;
} & TextFieldProps;

const FormikTextField: React.FC<Props> = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const textFieldProps = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    textFieldProps.error = true;
    textFieldProps.helperText = meta.error;
  }

  return <TextField {...textFieldProps} />;
};

export default FormikTextField;
