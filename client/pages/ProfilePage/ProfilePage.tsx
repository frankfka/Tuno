import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/common/NavigationBar/NavigationBar';
import useUser from '../../hooks/useUser';
import ProfilePageTabName from './ProfilePageTabName';
import ProfilePageTabSelect from './ProfilePageTabSelect';
import GeneralSection from './sections/GeneralSection';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 4),
  },
  tabContent: {
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
      <div className={classes.tabContent}>
        {user && <GeneralSection user={user} userSwr={userSwr} />}
      </div>
    </div>
  );
};

export default ProfilePage;
