import { Card, makeStyles } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import VoteForPost from '../../../types/VoteForPost';
import PostContentView from '../../components/Posts/PostContent/PostContentView';
import { VoteType } from '../../components/Posts/PostContent/PostContentVoteButtons';
import useGlobalState, {
  UseGlobalStateDataState,
} from '../../hooks/useGlobalState';
import useUser, { UseUserState } from '../../hooks/useUser';
import usePosts, {
  UsePostsState,
  UsePostsVariables,
} from '../../hooks/usePosts';
import getUserNumRemainingVotes from '../../util/getUserNumRemainingVotes';
import getUserVoteForPost from '../../util/getUserVoteForPost';
import HomePagePickerBar from './HomePagePickerBar';

type Props = {
  setShowLoginDialog(v: boolean): void;
  userState: UseUserState;
  usePostsVariables: UsePostsVariables;
  setUsePostsVariables: Dispatch<SetStateAction<UsePostsVariables>>;
  postsState: UsePostsState;
  globalState: UseGlobalStateDataState;
  onVoteClicked(postId: string, vote?: VoteType): void;
};

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    margin: theme.spacing(4, 8),
  },
  pagePickerBarContainer: {
    margin: theme.spacing(2, 0),
  },
  postItemContainer: {
    margin: theme.spacing(4, 0),
  },
}));

const HomePostsListContent: React.FC<Props> = ({
  // State
  userState,
  postsState,
  globalState,

  // Variables
  usePostsVariables,
  setUsePostsVariables,

  // Callbacks
  setShowLoginDialog,
  onVoteClicked,
}) => {
  const classes = useStyles();

  // User
  const { user, swr: userSwr } = userState;

  // Posts
  const {
    postsData,
    // TODO: loading state
    loading: loadingPosts,
    error: postsError,
    swr: postsSwr,
  } = postsState;

  const setTallyIndex = useCallback(
    (newTallyIndex: number) => {
      setUsePostsVariables((curr) => {
        return {
          ...curr,
          tallyIndex: newTallyIndex,
        };
      });
    },
    [setUsePostsVariables]
  );

  return (
    <div className={classes.contentContainer}>
      <Card className={classes.pagePickerBarContainer}>
        <HomePagePickerBar
          tallyIndex={usePostsVariables.tallyIndex}
          setTallyIndex={setTallyIndex}
          tallies={globalState.globalState?.tallies ?? []}
        />
      </Card>
      {/*TODO Back to top https://material-ui.com/components/app-bar/#back-to-top*/}
      <div>
        {postsData?.posts.map((post) => {
          const currentUserVote = getUserVoteForPost(post.id, user);
          const numRemainingUserVotes = getUserNumRemainingVotes(
            user,
            globalState.globalState
          );
          // Enable vote buttons if no user so we can show a login dialog
          const disableVoteButtons = user != null && numRemainingUserVotes < 1;

          return (
            <Card key={post.id} className={classes.postItemContainer}>
              <PostContentView
                post={post}
                onVoteClicked={onVoteClicked}
                currentUserVote={currentUserVote}
                disableVoteButtons={
                  disableVoteButtons && currentUserVote == null
                }
                enableTitleLink
                showFullContent
                showVoteButtons={usePostsVariables.tallyIndex === 0}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomePostsListContent;
