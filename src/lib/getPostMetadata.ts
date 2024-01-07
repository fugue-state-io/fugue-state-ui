import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { PostMetadata } from "../models/PostMetadata";

const getPostMetadata = (): PostMetadata[] => {
  const folder = path.join(process.cwd(), "src/posts");
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Get gray-matter data from each file.
  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`${folder}/${fileName}`, "utf8");
    const matterResult = matter(fileContents);
    return {
      title: matterResult.data.title,
      author: matterResult.data.author,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      slug: fileName.replace(".md", ""),
    };
  });

  return posts.reverse();
};

export default getPostMetadata;
