import Head from "next/head";
import React from 'react';
import CreatePostPage from "../components/CreatePostPage/CreatePostPage";

const Create = () => {

  return (
    <div>
      <Head>
        <title>Create a Post</title>
        <meta name="description" content="TODO" />
      </Head>
      <CreatePostPage />
    </div>
  );
};

export default Create;
