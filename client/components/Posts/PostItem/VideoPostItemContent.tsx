import { Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import ReactPlayer from 'react-player';

type Props = {
  videoSrc: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoContainer: {
      margin: 'auto',
    },
  })
);

const VideoPostItemContent: React.FC<Props> = ({ videoSrc }) => {
  const classes = useStyles();

  return (
    <Box>
      <ReactPlayer url={videoSrc} controls className={classes.videoContainer} />
    </Box>
  );
};

export default VideoPostItemContent;
