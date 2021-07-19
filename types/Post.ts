import PostContent from "./PostContent";

type Post = {
  id: string;
  createdAt: Date;
} & PostContent;

export default Post;
