import { Box, Link, Typography } from '@material-ui/core';
import React from 'react';

export const TallyHelpinfoDialogTitle = 'Tuno Tallies';

const TallyHelpInfoDialogContent = () => {
  return (
    <div>
      <Box fontWeight="fontWeightBold" marginBottom={2}>
        Tuno users help to curate the best content of the web by distributing a
        limited number of votes across posts.
      </Box>
      <Typography paragraph>
        We run a regular "tally" to rank the top scoring posts of a given time
        period. This represents some of the most noteworthy posts for that time
        period.
      </Typography>
      <Typography paragraph>
        Currently, the top ranked post is minted as an{' '}
        <Link
          href="https://ethereum.org/en/nft/"
          color="secondary"
          target="_blank"
        >
          NFT
        </Link>{' '}
        on the{' '}
        <Link
          href="https://polygon.technology/"
          color="secondary"
          target="_blank"
        >
          Polygon Blockchain
        </Link>
        .
      </Typography>
    </div>
  );
};

export default TallyHelpInfoDialogContent;
