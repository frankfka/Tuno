import Link from "next/link";
import { useRouter } from 'next/router'
import React, {useState} from 'react';
import PostContent from "../../types/PostContent";
import getLinkContentInfo from "../../util/getLinkContentInfo";

const CreatePostPage = () => {

  const router = useRouter()
  const [linkInput, setLinkInput] = useState('')
  const [titleInput, setTitleInput] = useState('')

  const [info, setInfo] = useState('')

  const onSubmit = async () => {
    const linkContentInfo = await getLinkContentInfo(linkInput);
    if (!linkContentInfo) {
      return;
    }

    setInfo(JSON.stringify(linkContentInfo))

    const postContent: PostContent = {
      title: titleInput,
      ...linkContentInfo
    }

    const resp = await fetch('/api/post', {
      method: 'POST',
      body: JSON.stringify(postContent),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const respJson = resp.json();
    console.log(respJson);

    router.push('/')
  }


  return (
    <div style={{padding: 40, textAlign: 'center'}}>

      <label>
        Title:
        <input type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)}/>
      </label>

      <label>
        Link:
        <input type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)}/>
      </label>

      <button onClick={onSubmit}>Submit</button>

      <div>
        <p>
          {info}
        </p>
      </div>

      <div>

        <Link href="/">
          <a>Back Home</a>
        </Link>

      </div>
    </div>
  );
};

export default CreatePostPage;
