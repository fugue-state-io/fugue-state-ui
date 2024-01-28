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
    <div className="mx-auto max-w-4xl text-base text-white">
      <a href="/blog">
        <svg
          viewBox="0 -9 3 24"
          className="overflow-visible mr-3 text-slate-400 w-auto h-6 group-hover:text-slate-600"
        >
          <path
            d="M3 0L0 3L3 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        Go Back
      </a>
      <div className="max-w-3xl mx-auto">
        <p className="mt-2">{post.data.date}</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl ">
          {post.data.title}
        </h1>
      </div>

      <article className="prose max-w-3xl mx-auto">
        <Markdown
          options={{
            overrides: {
              h1: {
                props: {
                  className: "text-4xl",
                },
              },
              h2: {
                props: {
                  className: "text-3xl mt-8",
                },
              },
              h3: {
                props: {
                  className: "text-2xl mt-8",
                },
              },
              p: {
                props: {
                  className: "text-lg mt-4",
                },
              },
              table: {
                props: {
                  className: "min-w-full divide-y divide-gray-700",
                },
              },
              img: {
                props: {
                  className: "w-full mt-3",
                },
              },
            },
          }}
        >
          {post.content}
        </Markdown>
      </article>
    </div>
  );
}
