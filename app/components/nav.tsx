"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Posts",
    match: (p: string) => p === "/" || p.startsWith("/posts"),
  },
  {
    href: "/projects",
    label: "잡동사니",
    match: (p: string) => p.startsWith("/projects"),
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-5 text-sm">
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "text-black dark:text-zinc-50 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
