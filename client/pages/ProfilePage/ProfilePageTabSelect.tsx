import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import ProfilePageTabName from './ProfilePageTabName';

type Props = {
  currentTab: ProfilePageTabName;
  setCurrentTab(v: ProfilePageTabName): void;
};

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    flexGrow: 1,
  },
}));

const ProfilePageTabSelect: React.FC<Props> = ({
  currentTab,
  setCurrentTab,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.tabsContainer}>
      <Tabs
        value={currentTab}
        onChange={(e, v) => setCurrentTab(v)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab
          label={ProfilePageTabName.General}
          value={ProfilePageTabName.General}
        />
        <Tab
          label={ProfilePageTabName.Posts}
          value={ProfilePageTabName.Posts}
        />
        <Tab
          label={ProfilePageTabName.Votes}
          value={ProfilePageTabName.Votes}
        />
      </Tabs>
    </Paper>
  );
};

export default ProfilePageTabSelect;
