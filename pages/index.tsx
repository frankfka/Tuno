import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import NavigationBar from '../client/components/common/NavigationBar/NavigationBar';
import useUser from '../client/hooks/auth/useUser';
import Post from '../types/Post';
import getCidGatewayUrl from '../util/getCidGatewayUrl';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const { user, loading: loadingUser } = useUser({});

  useEffect(() => {
    (async () => {
      const postsData = await fetch('/api/posts?tallyIndex=0');
      const postJson = await postsData.json();

      setPosts(postJson.data.posts as Post[]);
    })();
  }, []);

  const onLogoutClicked = () => {
    (async () => {
      const resp = await fetch('/api/auth/logout');
      const respJson = await resp.json();
      console.log('Logged out', respJson);
      location.reload();
    })();
  };

  const onVoteClicked = (postId: string) => {
    (async () => {
      const resp = await fetch(`/api/posts/vote`, {
        method: 'POST',
        body: JSON.stringify({
          postId: postId,
          voteWeight: 1,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Voted');
    })();
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationBar />

      <div>
        {user && (
          <div>
            <p>Current user:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <button onClick={onLogoutClicked}>Log Out</button>
          </div>
        )}
        {user == null && <Link href="/login">Login</Link>}
      </div>

      <Link href="/create">
        <a>Create</a>
      </Link>

      <div>
        {posts.map((post) => {
          const source =
            post.source.type === 'ipfs'
              ? getCidGatewayUrl(post.source.value)
              : post.source.value;
          let contentElement = (
            <a href={source} target="_blank" rel="noreferrer">
              Content Link
            </a>
          );
          if (post.contentType === 'img') {
            contentElement = <img src={source} />;
          } else if (post.contentType === 'av') {
            contentElement = <ReactPlayer url={source} controls />;
          }

          return (
            <div
              style={{ margin: 40, border: '1px solid black' }}
              key={post.id}
            >
              <h3>{post.title}</h3>
              <p>{post.createdAt}</p>
              {contentElement}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onVoteClicked(post.id);
                }}
              >
                Vote
              </button>
              <p>Votes: {post.voteScore}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
