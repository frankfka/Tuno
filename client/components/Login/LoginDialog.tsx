import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useState } from 'react';
import loginWithMagic from './loginWithMagic';

// Styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emailField: {
      margin: theme.spacing(0, 0, 2, 0),
    },
  })
);

type LoginDialogProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onLoginCompleted?: () => void;
};

// Main component
const LoginDialog = ({
  isOpen,
  setIsOpen,
  onLoginCompleted,
}: LoginDialogProps) => {
  const styles = useStyles();

  // Todo: error message on fail
  // TODO: Better validation
  const [attemptingLogin, setAttemptingLogin] = useState(false);
  const [email, setEmail] = useState('');

  function closeDialog() {
    setIsOpen(false);
  }

  async function onLoginSuccess() {
    // TODO: future onboarding workflow
    setAttemptingLogin(false);
    onLoginCompleted?.();
    setIsOpen(false);
  }

  async function onLoginFailure(error: Error) {
    setAttemptingLogin(false);
    console.error('Login failed', error);
  }

  async function onLoginClick() {
    setAttemptingLogin(true);
    await loginWithMagic(email.trim(), onLoginSuccess, onLoginFailure);
  }

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle>Log In or Sign Up</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To post and vote, please log in or sign up with your email.
        </DialogContentText>

        <TextField
          autoFocus
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.emailField}
        />

        <DialogActions>
          <Button
            autoFocus
            onClick={closeDialog}
            color="primary"
            disabled={attemptingLogin}
          >
            Cancel
          </Button>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={onLoginClick}
              disabled={!email || attemptingLogin}
            >
              {attemptingLogin ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </div>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
