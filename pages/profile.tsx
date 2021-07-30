import Head from 'next/head';
import ProfilePage from '../client/pages/ProfilePage/ProfilePage';

export default function Profile() {
  return (
    <>
      <Head>
        <title>Your Profile | tuno</title>
      </Head>

      <ProfilePage />
    </>
  );
}
