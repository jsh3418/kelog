import { Toc } from "@/app/components/toc";
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
  const {
    default: Post,
    metadata,
    toc,
  } = await import(`@/content/posts/${slug}.mdx`);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-900 overflow-x-clip">
      <div className="flex flex-1 w-full max-w-3xl">
        <article className="flex flex-1 w-full flex-col py-12 px-8 bg-white dark:bg-background">
          <header className="mb-8">
            <time className="text-sm text-zinc-500 dark:text-zinc-400">
              {metadata.date}
            </time>
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mt-2">
              {metadata.title}
            </h1>
          </header>

          {/* Mobile TOC: visible below xl */}
          <Toc
            toc={toc}
            className="xl:hidden mb-8 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/50"
          />

          <div className="prose dark:prose-invert max-w-none">
            <Post />
          </div>
        </article>

        {/* Desktop TOC: w-0 so it takes no layout space, overflow-visible so content shows */}
        <aside className="hidden xl:block w-0 overflow-visible">
          <Toc
            toc={toc}
            className="sticky top-24 ml-8 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden border-l border-zinc-200 dark:border-zinc-700 px-4 pt-4"
          />
        </aside>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
