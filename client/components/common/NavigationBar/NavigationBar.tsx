import Link from 'next/link';

import { Box, Button, NoSsr } from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useUser from '../../../hooks/auth/useUser';
import LoginDialog from '../../Login/LoginDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
  })
);

export default function NavigationBar() {
  const classes = useStyles();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user, loading: loadingUser } = useUser({});

  const onLoginCompleted = () => {};

  const isLoggedIn = user != null;

  const profileOrLoginCta = isLoggedIn ? (
    <IconButton color="inherit">
      <AccountCircle />
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

  return (
    <div className={classes.root}>
      {/*Login Dialog*/}
      <LoginDialog
        isOpen={showLoginDialog}
        setIsOpen={setShowLoginDialog}
        onLoginCompleted={onLoginCompleted}
      />

      {/*App Bar*/}
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h6">Talli</Typography>

          <Box flexGrow={1} />

          {/*Right Items*/}
          <div>
            <Button
              variant={isLoggedIn ? 'contained' : 'outlined'}
              color="primary"
              className={classes.createPostButton}
            >
              Create Post
            </Button>
            {profileOrLoginCta}
          </div>
        </Toolbar>
      </AppBar>
      {/*Extra toolbar to give margin to page content*/}
      <Toolbar />
    </div>
  );
}
