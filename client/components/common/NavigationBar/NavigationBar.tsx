import Link from 'next/link';
import Image from 'next/image';

import { Avatar, Box, Button, Chip, Grid, NoSsr } from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useGlobalState from '../../../hooks/useGlobalState';
import useUser from '../../../hooks/useUser';
import getUserNumRemainingVotes from '../../../util/getUserNumRemainingVotes';
import LoginDialog from '../../Login/LoginDialog';

import logo from '../../../../public/tuno.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
    },
    avatar: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    createPostButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    numRemainingVotes: {
      marginRight: theme.spacing(2),
    },
  })
);

export default function NavigationBar() {
  const classes = useStyles();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user, loading: loadingUser, swr: userSwr } = useUser({});
  const { globalState } = useGlobalState();

  const showNumRemainingVotes = user != null && globalState != null;
  const numRemainingVotes = getUserNumRemainingVotes(user, globalState);

  const onLoginCompleted = () => {
    userSwr.mutate();
  };

  const isLoggedIn = user != null;

  const profileOrLoginCta = isLoggedIn ? (
    <IconButton color="primary" size="small" href="/profile">
      {/*TODO avatar*/}
      <Avatar src="" className={classes.avatar} />
    </IconButton>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={() => setShowLoginDialog(true)}
    >
      Log In
    </Button>
  );

  // @ts-ignore
  // @ts-ignore
  return (
    <div className={classes.root}>
      {/*Login Dialog*/}
      <LoginDialog
        isOpen={showLoginDialog}
        setIsOpen={setShowLoginDialog}
        onLoginCompleted={onLoginCompleted}
      />

      {/*App Bar*/}
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
          <Box>
            <Link href="/">
              <a>
                <Image src={logo} height={36} width={84} />
              </a>
            </Link>
          </Box>

          <Box flexGrow={1} />

          {/*Right Items*/}
          <div>
            {showNumRemainingVotes && (
              <Chip
                color="secondary"
                label={`${numRemainingVotes.toFixed(0)} Vote${
                  numRemainingVotes !== 1 ? 's' : ''
                } Left`}
                className={classes.numRemainingVotes}
              />
            )}
            {profileOrLoginCta}
          </div>
        </Toolbar>
      </AppBar>
      {/*Extra toolbar to give margin to page content*/}
      <Toolbar />
    </div>
  );
}
