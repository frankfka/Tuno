import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';
import useUser from '../../hooks/useUser';
import PostsSection from './PostsSection/PostsSection';
import ProfilePageTabName from './ProfilePageTabName';
import ProfilePageTabSelect from './ProfilePageTabSelect';
import GeneralSection from './GeneralSection/GeneralSection';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 4),
  },
  tabContentContainer: {
    marginTop: theme.spacing(4),
  },
}));

const ProfilePage = () => {
  const classes = useStyles();

  // Tabs State
  const [currentTab, setCurrentTab] = useState<ProfilePageTabName>(
    ProfilePageTabName.General
  );

  // User
  const { user, swr: userSwr } = useUser({
    redirect: {
      ifNotAuthed: '/',
    },
  });

  // Section content
  let tabContent: React.ReactElement | undefined;
  if (user) {
    switch (currentTab) {
      case ProfilePageTabName.General:
        tabContent = <GeneralSection user={user} userSwr={userSwr} />;
        break;
      case ProfilePageTabName.Posts:
        tabContent = <PostsSection user={user} />;
        break;
    }
  }

  return (
    <div className={classes.root}>
      {/*Navigation*/}
      <NavigationBar />

      {/*Top Tabs Component*/}
      <ProfilePageTabSelect
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/*Content*/}
      <div className={classes.tabContentContainer}>{tabContent}</div>
    </div>
  );
};

export default ProfilePage;
