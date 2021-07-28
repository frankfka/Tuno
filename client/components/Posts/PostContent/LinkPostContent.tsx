import { Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import React from 'react';

type Props = {
  href: string;
};

const useStyles = makeStyles((theme) => ({
  linkContainer: {
    padding: theme.spacing(1, 2),
    maxWidth: '80%',
  },
  linkText: {
    marginLeft: theme.spacing(1),
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
  },
}));

const LinkPostContent: React.FC<Props> = ({ href }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.linkContainer} variant="outlined" elevation={0}>
      <Link href={href} target="_blank" rel="noreferrer" color="secondary">
        <Grid container direction="row" alignItems="center">
          <LinkIcon fontSize="inherit" />
          <Typography className={classes.linkText}>{href}</Typography>
        </Grid>
      </Link>
    </Paper>
  );
};

export default LinkPostContent;
