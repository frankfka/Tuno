import { Box, Container } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

// TODO a library like this? https://www.npmjs.com/package/rc-image

type Props = {
  imageSrc: string;
  alt: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imagePreview: {
      maxHeight: 512,
      margin: 'auto',
    },
  })
);

const ImagePostContent: React.FC<Props> = ({ imageSrc, alt }) => {
  const classes = useStyles();
  return (
    <Box display="flex">
      {/*eslint-disable-next-line @next/next/no-img-element*/}
      <img src={imageSrc} alt={alt} className={classes.imagePreview} />
    </Box>
  );
};

export default ImagePostContent;
