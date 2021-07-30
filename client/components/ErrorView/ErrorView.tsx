import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  errorIcon: {
    marginBottom: theme.spacing(1),
  },
}));

const ErrorView = () => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h1" className={classes.errorIcon}>
        😞
      </Typography>
      <Typography variant="subtitle1">
        Something went wrong. Please try again.
      </Typography>
    </Box>
  );
};

export default ErrorView;
