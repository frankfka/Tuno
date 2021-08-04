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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import React, { useCallback, useEffect, useState } from 'react';
import { ApiTallyData } from '../../../types/TallyData';
import getApiSafeDate from '../../../util/getApiSafeDate';
import useGlobalDialog from '../../hooks/useGlobalDialog';
import useGlobalState from '../../hooks/useGlobalState';
import TallyHelpInfoDialogContent, {
  TallyHelpinfoDialogTitle,
} from './TallyHelpInfoDialogContent';

type Props = {
  tallyIndex: number;
  setTallyIndex(v: number): void;
  tallies: ApiTallyData[];
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1),
  },
  tallyHelpIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const HomePagePickerBar: React.FC<Props> = ({
  tallyIndex,
  setTallyIndex,
  tallies,
}) => {
  const classes = useStyles();

  const globalDialogContext = useGlobalDialog();
  const { globalState } = useGlobalState();
  const [timeToNextTally, setTimeToNextTally] = useState<Duration>({});

  const updateTimeToNextTally = useCallback(() => {
    if (globalState?.nextTallyTime) {
      const nextTally = getApiSafeDate(globalState.nextTallyTime);

      setTimeToNextTally({
        ...intervalToDuration({
          end: nextTally,
          start: new Date(),
        }),
        seconds: 0,
      });
    }
  }, [globalState?.nextTallyTime]);

  // Update time to next tally every minute
  useEffect(() => {
    updateTimeToNextTally();
    const interval = setInterval(() => {
      updateTimeToNextTally();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [globalState?.nextTallyTime, updateTimeToNextTally]);

  let headerText = '';
  if (tallyIndex < tallies.length + 1) {
    headerText =
      tallyIndex === 0
        ? `Next Tally in ${formatDuration(timeToNextTally, {
            delimiter: ', ',
          })}`
        : format(parseISO(tallies[tallyIndex - 1].tallyTime), 'PP');
  }

  // On click for header text
  const onHeaderDateTextClicked = useCallback(() => {
    setTallyIndex(0);
  }, [setTallyIndex]);

  // On click for tally help icon
  const onHeaderHelpIconClicked = useCallback(() => {
    globalDialogContext.setInfoDialogData({
      title: TallyHelpinfoDialogTitle,
      content: <TallyHelpInfoDialogContent />,
    });
  }, [globalDialogContext]);

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
          color="secondary"
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
        {tallyIndex === 0 && (
          <IconButton
            size="small"
            className={classes.tallyHelpIcon}
            color="secondary"
            onClick={onHeaderHelpIconClicked}
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Grid>

      <Grid item>
        <IconButton
          color="secondary"
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
