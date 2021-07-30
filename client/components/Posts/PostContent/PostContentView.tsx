import Link from 'next/link';
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

import React, { useCallback } from 'react';
import { ApiPost } from '../../../../types/Post';
import { getCidGatewayUrl } from '../../../../util/cidUtils';
import getApiSafeDate from '../../../../util/getApiSafeDate';
import useGlobalDialog from '../../../hooks/useGlobalDialog';
import ImagePostContent from './ImagePostContent';
import LinkPostContent from './LinkPostContent';
import PostContentVoteButtons, { VoteType } from './PostContentVoteButtons';
import VideoPostContent from './VideoPostContent';

// TODO: Should clean up these props
type Props = {
  post: ApiPost;
  showVoteButtons: boolean;
  disableVoteButtons: boolean;
  enableTitleLink: boolean; // Add link to title to redirect onto post pages
  showFullContent: boolean;
  currentUserVote?: VoteType;
  onVoteClicked(postId: string, vote?: VoteType): void;
};

// Styles
const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(4, 4),
    },
    voteCountContainer: {
      minWidth: '5vw',
    },
    postTitle: (props: Props) => ({
      cursor: props.enableTitleLink ? 'pointer' : undefined,
    }),
    postAwardIcon: {
      cursor: 'pointer',
    },
  })
);

// TODO: Add username
const PostItemVotesSection: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const {
    post,
    showVoteButtons,
    disableVoteButtons,
    onVoteClicked,
    currentUserVote,
  } = props;

  const globalDialogContext = useGlobalDialog();
  const hasAward = post.awards.length > 0;

  const showAwardInfoDialog = useCallback(() => {
    hasAward &&
      globalDialogContext.setAwardInfoDialogData({
        id: post.awards[0],
      });
  }, [globalDialogContext.setAwardInfoDialogData, hasAward]);

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

  // Past score
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={classes.voteCountContainer}
    >
      {hasAward && (
        <>
          <Tooltip title="Click to see award NFT info" placement="top">
            <ButtonBase
              disableRipple
              disableTouchRipple
              onClick={showAwardInfoDialog}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h4" color="secondary">
                  🏆
                </Typography>
                <Typography variant="h6" color="secondary">
                  Top Post
                </Typography>
              </Box>
            </ButtonBase>
          </Tooltip>
        </>
      )}
      <Typography variant="caption">Votes</Typography>
      <Typography variant="h6">{post.voteScore.toFixed(0)}</Typography>
    </Box>
  );
};

const PostContentView: React.FC<Props> = (props) => {
  const { post, enableTitleLink, showFullContent } = props;
  const classes = useStyles(props);

  const source =
    post.source.type === 'ipfs'
      ? getCidGatewayUrl(post.source.value)
      : post.source.value;

  // Content
  let contentElement = <LinkPostContent href={source} />;

  if (post.contentType === 'img') {
    contentElement = <ImagePostContent alt="post content" imageSrc={source} />;
  } else if (post.contentType === 'av') {
    contentElement = <VideoPostContent videoSrc={source} />;
  }

  // Title
  let titleComponent = (
    <Typography
      variant="h5"
      className={classes.postTitle}
      display="block"
      gutterBottom
    >
      {post.title}
    </Typography>
  );

  if (enableTitleLink) {
    titleComponent = (
      <Link href={`/post/${post.id}`} passHref>
        {titleComponent}
      </Link>
    );
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
        <Typography variant="caption">
          {formatDistanceToNow(getApiSafeDate(post.createdAt), {
            addSuffix: true,
          })}
        </Typography>
        {titleComponent}
        {showFullContent && contentElement}
      </Grid>
    </Grid>
  );
};

export default PostContentView;
