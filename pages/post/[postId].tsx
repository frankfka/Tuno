import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import PostPage from '../../client/pages/PostPage/PostPage';
import cleanServerSideProps from '../../client/util/cleanServerSideProps';
import { getServerAppService } from '../../server/serverAppService';
import { ApiPost } from '../../types/Post';

type PostPageProps = {
  post: ApiPost;
};

export default function Post({ post }: PostPageProps) {
  return (
    <div>
      <Head>
        <title>View Post | tuno</title>
      </Head>

      <PostPage post={post} />
    </div>
  );
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps<
  PostPageProps,
  { postId: string }
> = async (context) => {
  const { postId } = context.query;

  if (typeof postId !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const appService = await getServerAppService();
  const postsData = await appService.getPostsById({ ids: [postId] });

  if (postsData.posts.length === 0) {
    return {
      notFound: true,
    };
  }

  const post = postsData.posts[0];
  const postPropObj: ApiPost = {
    ...cleanServerSideProps(post),
    createdAt: post.createdAt.toISOString(),
  };

  // Pass data to the page via props
  return {
    props: {
      post: postPropObj,
    },
  };
};
