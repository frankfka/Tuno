import { Box, Card, makeStyles, Typography } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { GetAllPostsParams } from '../../../server/types/GetPosts';
import LoadingView from '../../components/LoadingView/LoadingView';
import PostContentView from '../../components/Posts/PostContent/PostContentView';
import { VoteType } from '../../components/Posts/PostContent/PostContentVoteButtons';
import useGlobalState, {
  UseGlobalStateDataState,
} from '../../hooks/useGlobalState';
import { UsePostsState, UsePostsVariables } from '../../hooks/usePosts';
import useUser, { UseUserState } from '../../hooks/useUser';
import getUserNumRemainingVotes from '../../util/getUserNumRemainingVotes';
import getUserVoteForPost from '../../util/getUserVoteForPost';
import HomePagePickerBar from './HomePagePickerBar';

type Props = {
  userState: UseUserState;
  getAllPostsParams: GetAllPostsParams;
  setGetAllPostsParams: Dispatch<SetStateAction<GetAllPostsParams>>;
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
  noContentContainer: {
    margin: theme.spacing(4, 0),
    padding: theme.spacing(4, 4),
    minHeight: '50vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const HomePostsNoItemsContent: React.FC<{ tallyIndex: number }> = ({
  tallyIndex,
}) => {
  const classes = useStyles();

  const title = '😢 No Posts' + (tallyIndex === 0 ? ' Yet' : '');
  const subtitle = tallyIndex === 0 ? "Why don't you create one now?" : '';

  return (
    <Card className={classes.noContentContainer}>
      <Box textAlign="center">
        <Typography variant="h4" paragraph>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" color="secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

const HomePostsListContent: React.FC<Props> = ({
  // State
  userState,
  postsState,
  globalState,

  // Variables
  getAllPostsParams,
  setGetAllPostsParams,

  // Callbacks
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
      setGetAllPostsParams((curr) => {
        return {
          ...curr,
          tallyIndex: newTallyIndex,
        };
      });
    },
    [setGetAllPostsParams]
  );

  return (
    <div className={classes.contentContainer}>
      <Card className={classes.pagePickerBarContainer}>
        <HomePagePickerBar
          tallyIndex={getAllPostsParams.tallyIndex}
          setTallyIndex={setTallyIndex}
          tallies={globalState.globalState?.tallies ?? []}
        />
      </Card>

      {/*Loader*/}
      {loadingPosts && <LoadingView minHeight="50vh" />}

      {/*No Posts Content*/}
      {!loadingPosts && postsData?.posts.length === 0 && (
        <HomePostsNoItemsContent tallyIndex={getAllPostsParams.tallyIndex} />
      )}

      {/*Posts*/}
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
                showVoteButtons={getAllPostsParams.tallyIndex === 0}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomePostsListContent;
