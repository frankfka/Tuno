import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { ApiAward } from '../../../types/Award';
import { getCid, getCidGatewayUrl } from '../../../util/cidUtils';
import getApiSafeDate from '../../../util/getApiSafeDate';
import useGetAward from '../../hooks/useGetAward';
import getTransactionViewerUrl from '../../util/getTransactionViewerUrl';
import ErrorView from '../ErrorView/ErrorView';
import LoadingView from '../LoadingView/LoadingView';

type Props = {
  awardId: string;
  isOpen: boolean;
  closeDialog(): void;
};

const useStyles = makeStyles((theme) => ({
  awardInfoContainer: {
    padding: theme.spacing(0, 2),
  },
  textField: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
}));

const AwardInfoTextField: React.FC<
  Pick<TextFieldProps, 'label' | 'value' | 'helperText'>
> = (props) => {
  const classes = useStyles();
  return (
    <TextField
      InputProps={{
        readOnly: true,
      }}
      variant="outlined"
      className={classes.textField}
      {...props}
    />
  );
};

const AwardInfoContent: React.FC<{ award: ApiAward }> = ({ award }) => {
  const classes = useStyles();

  const metadataLink = getCidGatewayUrl(getCid(award.tokenData.metadataUri));
  const transactionLink = getTransactionViewerUrl(
    award.tokenData.transactionHash
  );
  const createdAtString = format(
    getApiSafeDate(award.createdAt),
    'h:maa - MMM d, yyyy'
  );

  return (
    <Grid direction="column" container alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h1">🏆</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5">Award Information</Typography>
      </Grid>
      <Grid item>
        <div className={classes.awardInfoContainer}>
          <AwardInfoTextField
            value={createdAtString}
            label="Time of Creation"
          />
          <AwardInfoTextField
            value={award.tokenData.tokenId}
            label="Token ID"
          />
          <AwardInfoTextField
            value={award.tokenData.transactionHash}
            label="Transaction Hash"
            helperText={
              <Link href={transactionLink} target="_blank" color="secondary">
                View Transaction
              </Link>
            }
          />
          <AwardInfoTextField
            value={award.tokenData.metadataUri}
            label="Metadata URI"
            helperText={
              <Link href={metadataLink} target="_blank" color="secondary">
                View Metadata
              </Link>
            }
          />
        </div>
      </Grid>
    </Grid>
  );
};

const AwardInfoDialog: React.FC<Props> = ({ awardId, isOpen, closeDialog }) => {
  const classes = useStyles();

  const { loading, award, error } = useGetAward({ id: awardId });

  let contentElement: React.ReactElement | undefined = undefined;

  if (award) {
    contentElement = <AwardInfoContent award={award} />;
  } else if (loading) {
    contentElement = <LoadingView minHeight="30vh" />;
  } else if (error != null) {
    contentElement = <ErrorView />;
  }

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth>
      <DialogContent>{contentElement}</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AwardInfoDialog;
