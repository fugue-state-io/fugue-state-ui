import getPostMetadata from "../../lib/getPostMetadata";
import PostPreview from "../../components/PostPreview";
import { PostMetadata } from "../../models/PostMetadata";

export default function BlogPage() {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">{postPreviews}</div>
  );
}
