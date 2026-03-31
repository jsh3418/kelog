import { getPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await import(`@/content/posts/${slug}.mdx`);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const { default: Post, metadata } = await import(
    `@/content/posts/${slug}.mdx`
  );

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <article className="flex flex-1 w-full max-w-3xl flex-col py-12 px-8 bg-white dark:bg-background">
        <header className="mb-8">
          <time className="text-sm text-zinc-500 dark:text-zinc-400">
            {metadata.date}
          </time>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mt-2">
            {metadata.title}
          </h1>
        </header>
        <div className="prose dark:prose-invert max-w-none">
          <Post />
        </div>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
