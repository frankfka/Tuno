import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import Link from 'next/link';
import React, { useState } from 'react';
import PostContent from '../../../types/PostContent';
import getLinkContentInfo from '../../../util/getLinkContentInfo';
import CreatePostForm from './CreatePostForm';

const useStyles = makeStyles((theme) => ({
  createPostContent: {
    paddingBottom: theme.spacing(2),
  },
}));

type CreatePostDialogProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onCreate: (postId: string) => void;
};

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  setIsOpen,
  onCreate,
}) => {
  const classes = useStyles();

  function closeDialog() {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth>
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent className={classes.createPostContent}>
        <CreatePostForm onCreate={onCreate} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
