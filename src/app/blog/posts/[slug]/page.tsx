import fs from "fs";
import path from "path";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import getPostMetadata from "../../../../lib/getPostMetadata";
const getPostContent = (slug: string) => {
  const folder = path.join(process.cwd(), "src/posts");
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

export default function PostPage(props: any) {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  return (
    <div className="mx-auto max-w-4xl text-base text-gray-700 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {post.data.title}
        </h1>
        <p className="mt-2">{post.data.date}</p>
      </div>

      <article className="prose max-w-3xl mx-auto">
        <Markdown options={{
          overrides: {
            h1: {
              props: {
                className: 'text-4xl'
              }
            },
            h2: {
              props: {
                className: 'text-3xl mt-8'
              }
            },
            h3: {
              props: {
                className: 'text-2xl mt-8'
              }
            },
            p: {
              props: {
                className: 'text-lg mt-4'
              }
            },
            table: {
              props: {
                className: 'min-w-full divide-y divide-gray-700'
              }
            }
          }
        }}>{post.content}</Markdown>
      </article>
    </div>
  );
}
