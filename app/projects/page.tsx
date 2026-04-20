import { GithubIcon } from "@/app/components/github-icon";
import { projects } from "@/content/projects";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "잡동사니 | kelog",
  description: "만들어본 잡동사니 프로젝트 모음",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-12 px-8 bg-white dark:bg-background">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-12">
          잡동사니
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li key={project.title}>
              <article className="group relative flex h-full flex-col rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/30 p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-500">
                <h2 className="text-lg font-medium text-black dark:text-zinc-50 group-hover:underline">
                  {project.title}
                </h2>
                <p className="mt-1.5 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>

                <Link
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} 바로가기`}
                  className="absolute inset-0 rounded-lg"
                />

                <div className="relative mt-4 flex items-center">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} GitHub 저장소`}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-zinc-50"
                  >
                    <GithubIcon />
                    <span>GitHub</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
