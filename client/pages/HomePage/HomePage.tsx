import { makeStyles, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import VoteForPost from '../../../types/VoteForPost';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';
import CreatePostDialog from '../../components/CreatePost/CreatePostDialog';
import CreatePostFab from '../../components/CreatePost/CreatePostFab';
import LoginDialog from '../../components/Login/LoginDialog';
import useGlobalState from '../../hooks/useGlobalState';
import usePosts, { UsePostsVariables } from '../../hooks/usePosts';
import useUser from '../../hooks/useUser';
import callVoteApi from '../../util/api/callVoteApi';
import HomePostsContent from './HomePostsContent';

const useStyles = makeStyles((theme) => ({}));

export default function HomePage() {
  const classes = useStyles();

  // Dialogs
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Global state
  const globalState = useGlobalState();

  // User
  const userState = useUser({});
  const { user, swr: userSwr } = userState;
  const onLoginCompleted = useCallback(() => {
    userSwr.mutate();
  }, [userSwr]);

  // Posts
  const [usePostsVariables, setUsePostsVariables] = useState<UsePostsVariables>(
    {
      tallyIndex: 0,
    }
  );
  const postsState = usePosts(usePostsVariables);
  const { swr: postsSwr } = postsState;
  // TODO Reset tally index when globalState tallies changes

  // Voting
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

  // Create post
  const onCreatePostFabClicked = () => {
    user ? setShowCreatePostDialog(true) : setShowLoginDialog(true);
  };

  const [showCreatePostSuccessAlert, setShowCreatePostSuccessAlert] =
    useState(false);
  const closeCreatePostSuccessAlert = () =>
    setShowCreatePostSuccessAlert(false);

  const onPostCreate = (postId: string) => {
    setShowCreatePostDialog(false);
    setShowCreatePostSuccessAlert(true);

    // Invalidate SWR query
    postsSwr.mutate();
  };

  // TODO: loading (maybe have a wrapper?)
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/*Navigation*/}
      <NavigationBar />

      {/*Create Post FAB*/}
      <CreatePostFab onClick={onCreatePostFabClicked} />

      {/*Create Post Dialog*/}
      <CreatePostDialog
        isOpen={showCreatePostDialog}
        setIsOpen={setShowCreatePostDialog}
        onCreate={onPostCreate}
      />
      <Snackbar
        open={showCreatePostSuccessAlert}
        autoHideDuration={5000}
        onClose={closeCreatePostSuccessAlert}
      >
        <Alert onClose={closeCreatePostSuccessAlert} severity="success">
          Your post was published successfully!
        </Alert>
      </Snackbar>

      {/*Login Dialog*/}
      <LoginDialog
        isOpen={showLoginDialog}
        setIsOpen={setShowLoginDialog}
        onLoginCompleted={onLoginCompleted}
      />

      <HomePostsContent
        setShowLoginDialog={setShowLoginDialog}
        userState={userState}
        usePostsVariables={usePostsVariables}
        setUsePostsVariables={setUsePostsVariables}
        postsState={postsState}
        globalState={globalState}
        onVoteClicked={onVoteClicked}
      />
    </div>
  );
}
