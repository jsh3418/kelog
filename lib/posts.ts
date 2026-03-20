import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs();

  const posts = slugs.map((slug) => {
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    const content = fs.readFileSync(filePath, "utf-8");
    const metadata = extractMetadata(content);
    return { slug, ...metadata } as PostMeta;
  });

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function extractMetadata(
  content: string
): Omit<PostMeta, "slug"> {
  const match = content.match(
    /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});/
  );
  if (!match) throw new Error("No metadata found in MDX file");
  return new Function(`return ${match[1]}`)() as Omit<PostMeta, "slug">;
}
