import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-12">
          Posts
        </h1>
        <ul className="flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group block"
              >
                <time className="text-sm text-zinc-500 dark:text-zinc-400">
                  {post.date}
                </time>
                <h2 className="text-lg font-medium text-black dark:text-zinc-50 group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
