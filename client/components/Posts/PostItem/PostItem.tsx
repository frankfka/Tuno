import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import React from 'react';
import Post from '../../../../types/Post';
import getCidGatewayUrl from '../../../../util/getCidGatewayUrl';
import ImagePostItemContent from './ImagePostItemContent';
import LinkPostItemContent from './LinkPostItemContent';
import PostItemVoteButtons, { VoteType } from './PostItemVoteButtons';
import VideoPostItemContent from './VideoPostItemContent';

type Props = {
  post: Post;
  currentUserVote?: VoteType;
  onVoteClicked(postId: string, vote?: VoteType): void;
};

// Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(4, 2),
    },
    postTitle: {
      marginBottom: theme.spacing(2),
    },
  })
);

const PostItem: React.FC<Props> = ({
  post,
  onVoteClicked,
  currentUserVote,
}) => {
  const classes = useStyles();

  const source =
    post.source.type === 'ipfs'
      ? getCidGatewayUrl(post.source.value)
      : post.source.value;

  let contentElement = <LinkPostItemContent href={source} />;

  if (post.contentType === 'img') {
    contentElement = (
      <ImagePostItemContent alt="post content" imageSrc={source} />
    );
  } else if (post.contentType === 'av') {
    contentElement = <VideoPostItemContent videoSrc={source} />;
  }

  return (
    <Paper className={classes.container}>
      <Grid container wrap="nowrap" spacing={4} alignItems="flex-start">
        <Grid item>
          <PostItemVoteButtons
            canCreateVote={true}
            onVote={(v) => {
              onVoteClicked(post.id, v);
            }}
            score={post.voteScore}
            currentVote={currentUserVote}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="caption" className={classes.postTitle}>
            {/*TODO: Created At*/}
            {post.createdAt}
          </Typography>
          <Typography variant="h5" className={classes.postTitle}>
            {post.title}
          </Typography>
          {contentElement}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostItem;
