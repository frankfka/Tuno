import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { format, formatDuration, intervalToDuration, parseISO } from 'date-fns';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import React, { useCallback } from 'react';
import { ApiTallyData } from '../../../types/TallyData';
import useNextTallyTime from '../../hooks/useNextTallyTime()';

type Props = {
  tallyIndex: number;
  setTallyIndex(v: number): void;
  tallies: ApiTallyData[];
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

  const nextTallyTime = useNextTallyTime(60 * 1000);

  let headerText = '';
  if (tallyIndex < tallies.length + 1) {
    headerText =
      tallyIndex === 0
        ? `Next Tally in ${formatDuration(
            {
              ...intervalToDuration({
                end: nextTallyTime,
                start: new Date(),
              }),
              seconds: 0,
            },
            {
              delimiter: ', ',
            }
          )}`
        : format(parseISO(tallies[tallyIndex - 1].tallyTime), 'PP');
  }

  const onHeaderDateTextClicked = useCallback(() => {
    setTallyIndex(0);
  }, [setTallyIndex]);

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
        <Tooltip title="Jump to current" placement="top">
          <Button
            color="primary"
            onClick={onHeaderDateTextClicked}
            variant="outlined"
          >
            <Box fontWeight="fontWeightBold">
              <Typography>{headerText}</Typography>
            </Box>
          </Button>
        </Tooltip>
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
