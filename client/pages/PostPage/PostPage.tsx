import { Card, makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { ApiPost } from '../../../types/Post';
import VoteForPost from '../../../types/VoteForPost';
import getApiSafeDate from '../../../util/getApiSafeDate';
import getLastTallyTime from '../../../util/getLastTallyTime';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';
import LoginDialog from '../../components/LoginDialog/LoginDialog';
import PostContentView from '../../components/Posts/PostContent/PostContentView';
import useGlobalDialog from '../../hooks/useGlobalDialog';
import useGlobalState from '../../hooks/useGlobalState';
import usePosts from '../../hooks/usePosts';
import useUser from '../../hooks/useUser';
import callVoteApi from '../../util/api/callVoteApi';
import getUserNumRemainingVotes from '../../util/getUserNumRemainingVotes';
import getUserVoteForPost from '../../util/getUserVoteForPost';

type Props = {
  post: ApiPost;
};

const useStyles = makeStyles((theme) => ({
  postContentContainer: {
    margin: theme.spacing(4, 4),
  },
}));

export default function PostPage({ post: initialPost }: Props) {
  const classes = useStyles();

  const globalDialogContext = useGlobalDialog();
  const { globalState } = useGlobalState();
  const { user, swr: userSwr } = useUser({});

  const { postsData, swr: postsSwr } = usePosts({
    getPostsByIdParams: {
      ids: [initialPost.id],
    },
  });
  const latestPost: ApiPost | undefined =
    postsData != null && postsData.posts.length > 0
      ? postsData.posts[0]
      : undefined;

  const post = latestPost ?? initialPost;

  // Login Dialog
  const onLoginCompleted = useCallback(() => {
    userSwr.mutate();
  }, [userSwr]);
  const showLoginDialog = useCallback(() => {
    globalDialogContext.setLoginDialogData({
      onLoginCompleted,
    });
  }, [globalDialogContext, onLoginCompleted]);

  // Handler for voting
  const onVoteClicked = useCallback(
    async (postId: string, vote?: VoteForPost) => {
      if (user == null) {
        showLoginDialog();
        return;
      }

      // Call API
      await callVoteApi(postId, vote);

      postsSwr.mutate();
      userSwr.mutate();
    },
    [showLoginDialog, user, userSwr]
  );

  // Post content render state
  const currentUserVote = getUserVoteForPost(post.id, user);
  const numRemainingUserVotes = getUserNumRemainingVotes(user, globalState);
  // Show vote buttons only if this post is part of current tally
  const showVoteButtons =
    getApiSafeDate(post.createdAt) >
    getLastTallyTime(globalState?.tallies ?? []);
  // Enable vote buttons if no user so we can show a login dialog
  const disableVoteButtons = user != null && numRemainingUserVotes < 1;

  return (
    <div>
      {/*Navigation*/}
      <NavigationBar />

      {/*Post Content*/}
      <Card className={classes.postContentContainer}>
        <PostContentView
          post={post}
          onVoteClicked={onVoteClicked}
          currentUserVote={currentUserVote}
          enableTitleLink={false}
          disableVoteButtons={disableVoteButtons}
          showVoteButtons={showVoteButtons}
          showFullContent
        />
      </Card>
    </div>
  );
}
