import { Card, makeStyles } from '@material-ui/core';
import React from 'react';
import { ApiUser } from '../../../../types/User';
import PostContentView from '../../../components/Posts/PostContent/PostContentView';
import usePosts from '../../../hooks/usePosts';

type Props = {
  user: ApiUser;
};

const useStyles = makeStyles((theme) => ({
  postItemContainer: {
    margin: theme.spacing(4, 0),
  },
}));

const VotesSection: React.FC<Props> = ({ user }) => {
  const classes = useStyles();

  const { postsData } = usePosts({
    getPostsByIdParams: { ids: user.votes.map((v) => v.post) },
  });

  return (
    <div>
      {postsData?.posts.map((post) => {
        return (
          <Card key={post.id} className={classes.postItemContainer}>
            <PostContentView
              post={post}
              onVoteClicked={() => {}}
              disableVoteButtons
              enableTitleLink
              showVoteButtons={false}
              showFullContent={false}
            />
          </Card>
        );
      })}
    </div>
  );
};

export default VotesSection;
