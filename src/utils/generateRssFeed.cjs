const fs = require("fs")
const RSS = require("rss")

const matter = require("gray-matter")
const path = require("path");

const getPostMetadata = () => {
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

async function generateRssFeed() {
  const site_url = "https://fugue-state.io"

  const feedOptions = {
    title: "Fugue-state.io blog posts / rss feed",
    description: "Welcome to this blog posts!",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/logo.jpeg`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  };

  const feed = new RSS(feedOptions);

  // Add each individual post to the feed.
  getPostMetadata().map((post) => {
    feed.item({
      title: post.title,
      description: post.subtitle,
      url: `${site_url}/blog/posts/${post.slug}`,
      date: post.date,
    });
  });

  // Write the RSS feed to a file as XML.
  fs.writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
}
generateRssFeed();