import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import React from 'react';
import TallyData from '../../../types/TallyData';

type Props = {
  tallyIndex: number;
  setTallyIndex(v: number): void;
  tallies: TallyData[];
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1),
  },
}));

const HomePagePickerBar: React.FC<Props> = ({
  tallyIndex,
  setTallyIndex,
  tallies,
}) => {
  const classes = useStyles();

  const headerText =
    tallyIndex === 0 ? 'Current' : tallies[tallyIndex - 1].tallyTime.toString();

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classes.container}
    >
      <Grid item>
        <IconButton
          color="primary"
          disabled={tallyIndex === 0}
          onClick={() => setTallyIndex(tallyIndex - 1)}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Grid>

      <Grid item>
        <Box fontWeight="fontWeightBold">
          <Typography variant="h6">{headerText}</Typography>
        </Box>
      </Grid>

      <Grid item>
        <IconButton
          color="primary"
          disabled={tallyIndex > tallies.length - 1}
          onClick={() => setTallyIndex(tallyIndex + 1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default HomePagePickerBar;
