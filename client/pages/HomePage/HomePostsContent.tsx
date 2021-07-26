import { Card, makeStyles } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import VoteForPost from '../../../types/VoteForPost';
import PostItem from '../../components/Posts/PostItem/PostItem';
import useGlobalState from '../../hooks/useGlobalState';
import useUser from '../../hooks/useUser';
import usePosts, { UsePostsVariables } from '../../hooks/usePosts';
import callVoteApi from '../../util/api/callVoteApi';
import getUserNumRemainingVotes from '../../util/getUserNumRemainingVotes';
import getUserVoteForPost from '../../util/getUserVoteForPost';
import HomePagePickerBar from './HomePagePickerBar';

type Props = {
  setShowLoginDialog(v: boolean): void;
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

const HomePostsContent: React.FC<Props> = ({ setShowLoginDialog }) => {
  const classes = useStyles();

  const { globalState } = useGlobalState();
  const { user, swr: userSwr } = useUser({});

  const [usePostsVariables, setUsePostsVariables] = useState<UsePostsVariables>(
    {
      tallyIndex: 0,
    }
  );
  const setTallyIndex = (newTallyIndex: number) => {
    setUsePostsVariables((curr) => {
      return {
        ...curr,
        tallyIndex: newTallyIndex,
      };
    });
  };

  const {
    postsData,
    // TODO: loading state
    loading: loadingPosts,
    error: postsError,
    swr: postsSwr,
  } = usePosts(usePostsVariables);

  const onVoteClicked = useCallback(
    async (postId: string, vote?: VoteForPost) => {
      if (user == null) {
        setShowLoginDialog(true);
        return;
      }

      /*
    TODO: These local updates don't seem to work, try putting wait in `vote.ts` - these update afterwards
    - Maybe because of async? Updates are called at the very end.

    // Mutate local data for user
    const voteWeight = convertVoteForPostToWeight(vote);
    userSwr.mutate((data) => {
      data?.data?.votes?.push({
        createdAt: new Date(),
        post: postId,
        weight: voteWeight,
      });
      return data;
    }, false);

    // Mutate local data for post
    postsSwr.mutate((data) => {
      const postToVote = data?.data?.posts?.find((p) => p.id === postId);
      if (postToVote != null) {
        postToVote.voteScore += voteWeight;
      }
      return data;
    }, false);
     */

      // Call API
      await callVoteApi(postId, vote);

      userSwr.mutate();
      postsSwr.mutate();
    },
    [postsSwr, setShowLoginDialog, user, userSwr]
  );

  return (
    <div className={classes.contentContainer}>
      <Card className={classes.pagePickerBarContainer}>
        <HomePagePickerBar
          tallyIndex={usePostsVariables.tallyIndex}
          setTallyIndex={setTallyIndex}
          tallies={globalState?.tallies ?? []}
        />
      </Card>
      {/*TODO Back to top https://material-ui.com/components/app-bar/#back-to-top*/}
      <div>
        {/*TODO enable vote click if not logged in, then show dialog*/}
        {postsData?.posts.map((post) => {
          return (
            <Card key={post.id} className={classes.postItemContainer}>
              <PostItem
                post={post}
                onVoteClicked={onVoteClicked}
                currentUserVote={
                  user != null ? getUserVoteForPost(post, user) : undefined
                }
                userHasMoreVotes={
                  getUserNumRemainingVotes(user, globalState) > 0
                }
                showVoteButtons={usePostsVariables.tallyIndex === 0}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomePostsContent;
