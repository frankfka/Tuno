import { Card, makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { ApiPost } from '../../../types/Post';
import VoteForPost from '../../../types/VoteForPost';
import getApiSafeDate from '../../../util/getApiSafeDate';
import getLastTallyTime from '../../../util/getLastTallyTime';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';
import LoginDialog from '../../components/Login/LoginDialog';
import PostContentView from '../../components/Posts/PostContent/PostContentView';
import useGlobalState from '../../hooks/useGlobalState';
import usePost from '../../hooks/usePost';
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

  const { globalState } = useGlobalState();
  const { user, swr: userSwr } = useUser({});

  // Also fetch latest data but use initial server-side props as a fallback
  const { post: latestPost, swr: postSwr } = usePost({
    postId: initialPost.id,
  });
  const post = latestPost ?? initialPost;

  // Login Dialog
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const onLoginCompleted = useCallback(() => {
    userSwr.mutate();
  }, [userSwr]);

  // Handler for voting
  const onVoteClicked = useCallback(
    async (postId: string, vote?: VoteForPost) => {
      if (user == null) {
        setShowLoginDialog(true);
        return;
      }

      // Call API
      await callVoteApi(postId, vote);

      postSwr.mutate();
      userSwr.mutate();
    },
    [setShowLoginDialog, user, userSwr]
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

      {/*Login Dialog*/}
      <LoginDialog
        isOpen={showLoginDialog}
        setIsOpen={setShowLoginDialog}
        onLoginCompleted={onLoginCompleted}
      />

      {/*Post Content*/}
      <Card className={classes.postContentContainer}>
        <PostContentView
          post={post}
          onVoteClicked={onVoteClicked}
          currentUserVote={currentUserVote}
          disableVoteButtons={disableVoteButtons}
          showVoteButtons={showVoteButtons}
        />
      </Card>
    </div>
  );
}
