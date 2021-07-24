import { Box, Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { ComponentProps } from 'react';

const useStyles = makeStyles((theme) => ({
  createPostFab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  addIcon: {
    marginRight: theme.spacing(1),
  },
  text: {
    marginRight: theme.spacing(1),
  },
}));

type Props = {
  onClick: () => void;
};

const CreatePostFab: React.FC<Props> = ({ onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.createPostFab}>
      <Fab variant="extended" color="primary" onClick={onClick}>
        <AddIcon className={classes.addIcon} />
        <Box fontSize="subtitle1.fontSize" className={classes.text}>
          Post
        </Box>
      </Fab>
    </div>
  );
};

export default CreatePostFab;
