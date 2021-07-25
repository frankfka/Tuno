import { Grid, IconButton, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';

export type VoteType = 'up' | 'down';

type Props = {
  currentVote?: VoteType;
  score: number;
  canCreateVote: boolean;
  onVote(vote?: VoteType): void;
};

const PostItemVoteButtons: React.FC<Props> = ({
  onVote,
  currentVote,
  score,
  canCreateVote,
}) => {
  const disabled = !canCreateVote && currentVote == null;

  const onUpvoteClicked = () => {
    if (currentVote === 'up') {
      onVote();
    } else if (!disabled) {
      onVote('up');
    }
  };

  const onDownvoteClicked = () => {
    if (currentVote === 'down') {
      onVote();
    } else if (!disabled) {
      onVote('down');
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton
        onClick={onUpvoteClicked}
        disabled={disabled}
        color={currentVote === 'up' ? 'secondary' : 'default'}
      >
        <KeyboardArrowUpIcon color="inherit" />
      </IconButton>
      <Typography>{score.toFixed(0)}</Typography>
      <IconButton
        onClick={onDownvoteClicked}
        disabled={disabled}
        color={currentVote === 'down' ? 'secondary' : 'default'}
      >
        <KeyboardArrowDownIcon color="inherit" />
      </IconButton>
    </Grid>
  );
};

export default PostItemVoteButtons;
