import {
  Box,
  ButtonBase,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { formatDistanceToNow, parseISO } from 'date-fns';

import React from 'react';
import { ApiPost } from '../../../../types/Post';
import getCidGatewayUrl from '../../../../util/getCidGatewayUrl';
import ImagePostContent from './ImagePostContent';
import LinkPostContent from './LinkPostContent';
import PostContentVoteButtons, { VoteType } from './PostContentVoteButtons';
import VideoPostContent from './VideoPostContent';

type Props = {
  post: ApiPost;
  showVoteButtons: boolean;
  disableVoteButtons: boolean;
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
    postAwardIcon: {
      cursor: 'pointer',
    },
  })
);

const PostItemVotesSection: React.FC<Props> = (props) => {
  const classes = useStyles();

  const {
    post,
    showVoteButtons,
    disableVoteButtons,
    onVoteClicked,
    currentUserVote,
  } = props;

  const hasAward = post.awards.length > 0;

  // Vote buttons
  if (showVoteButtons) {
    return (
      <PostContentVoteButtons
        disableVoteButtons={disableVoteButtons}
        onVote={(v) => {
          onVoteClicked(post.id, v);
        }}
        score={post.voteScore}
        currentVote={currentUserVote}
      />
    );
  }

  // TODO: Onclick for nft award info
  // Past score
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {hasAward && (
        <>
          <Tooltip title="Click to see award NFT info" placement="top">
            <ButtonBase disableRipple disableTouchRipple>
              <Box display="flex" flexDirection="column" alignItems="center">
                <StarsIcon fontSize="large" color="secondary" />
                <Typography variant="h6" color="secondary">
                  Top Post
                </Typography>
              </Box>
            </ButtonBase>
          </Tooltip>
        </>
      )}
      <Typography variant="caption">Final Score</Typography>
      <Typography variant="h6">{post.voteScore.toFixed(0)}</Typography>
    </Box>
  );
};

const PostContentView: React.FC<Props> = (props) => {
  const { post } = props;
  const classes = useStyles();

  const source =
    post.source.type === 'ipfs'
      ? getCidGatewayUrl(post.source.value)
      : post.source.value;

  let contentElement = <LinkPostContent href={source} />;

  if (post.contentType === 'img') {
    contentElement = <ImagePostContent alt="post content" imageSrc={source} />;
  } else if (post.contentType === 'av') {
    contentElement = <VideoPostContent videoSrc={source} />;
  }

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={4}
      alignItems="flex-start"
      className={classes.container}
    >
      <Grid item>
        <PostItemVotesSection {...props} />
      </Grid>
      <Grid item xs>
        <Typography variant="caption" className={classes.postTitle}>
          {formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}
        </Typography>
        <Typography variant="h5" className={classes.postTitle}>
          {post.title}
        </Typography>
        {contentElement}
      </Grid>
    </Grid>
  );
};

export default PostContentView;
