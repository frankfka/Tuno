import { Link, Typography } from '@material-ui/core';
import React from 'react';

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

export default CreatePostFormLinkHelperText;
