import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import { Property } from 'csstype';
import React from 'react';

type Props = {
  minHeight?: Property.MinHeight;
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    minHeight: (props: Props) => props.minHeight,
  },
}));

const LoadingView: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.loadingContainer}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingView;
