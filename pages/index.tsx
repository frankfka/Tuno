import Head from 'next/head';
import HomePage from '../client/pages/HomePage/HomePage';

export default function Home() {
  return (
    <>
      <Head>
        <title>Browse | tuno</title>
        <meta
          name="description"
          content="The need-to-know content of the web."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePage />
    </>
  );
}
