import Link from "next/link";
import { PostMetadata } from "../models/PostMetadata";

const PostPreview = (props: PostMetadata) => {
  return (
    <div className="border border-slate-300 p-4 rounded-md shadow-sm bg-white max-w-4xl">
      <p className="text-sm text-slate-400">{props.date}</p>
      <Link href={`/blog/posts/${props.slug}`}>
        <h2 className="text-violet-600 hover:underline mb-4">{props.title}</h2>
      </Link>
      <p className="text-slate-700">{props.subtitle}</p>
    </div>
  );
};

export default PostPreview;
