import { Card, makeStyles } from '@material-ui/core';
import React from 'react';
import { ApiUser } from '../../../../types/User';
import getApiSafeDate from '../../../../util/getApiSafeDate';
import getLastTallyTime from '../../../../util/getLastTallyTime';
import PostContentView from '../../../components/Posts/PostContent/PostContentView';
import useGlobalState from '../../../hooks/useGlobalState';
import usePostsByAuthor from '../../../hooks/usePostsByAuthor';
import getUserNumRemainingVotes from '../../../util/getUserNumRemainingVotes';
import getUserVoteForPost from '../../../util/getUserVoteForPost';

type Props = {
  user: ApiUser;
};

const useStyles = makeStyles((theme) => ({
  postItemContainer: {
    margin: theme.spacing(4, 0),
  },
}));

const PostsSection: React.FC<Props> = ({ user }) => {
  const classes = useStyles();

  const { postsData } = usePostsByAuthor({ authorId: user.id });
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

export default PostsSection;
