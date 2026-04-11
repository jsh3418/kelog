"use client";

import type { Toc as ExtractedToc } from "@stefanprobst/rehype-extract-toc";
import { useEffect, useMemo, useState } from "react";

interface TocProps {
  toc: ExtractedToc;
  className?: string;
}

const MAX_DEPTH = 3;

function collectIds(nodes: ExtractedToc): string[] {
  const ids: string[] = [];
  const walk = (ns: ExtractedToc) => {
    for (const n of ns) {
      if (n.id && n.depth <= MAX_DEPTH) ids.push(n.id);
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return ids;
}

export function Toc({ toc, className }: TocProps) {
  const ids = useMemo(() => collectIds(toc), [toc]);
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  if (ids.length === 0) return null;

  return (
    <nav aria-label="Table of Contents" className={className}>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        목차
      </p>
      <TocList nodes={toc} activeId={activeId} />
    </nav>
  );
}

function TocList({
  nodes,
  activeId,
}: {
  nodes: ExtractedToc;
  activeId: string;
}) {
  const items = nodes.flatMap((node) => {
    const tooDeep = node.depth > MAX_DEPTH;
    const renderSelf = !tooDeep && node.id;
    const children = node.children?.length ? node.children : undefined;

    if (!renderSelf && !children) return [];

    return [
      <li key={node.id ?? `d${node.depth}-${node.value}`}>
        {renderSelf && (
          <a
            href={`#${node.id}`}
            aria-current={activeId === node.id ? "true" : undefined}
            className={`block py-0.5 transition-colors duration-150 ${
              activeId === node.id
                ? "text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(node.id!);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                history.replaceState(null, "", `#${node.id}`);
              }
            }}
          >
            {node.value}
          </a>
        )}
        {children && (
          <ul className="pl-4 mt-1 space-y-1.5">
            <TocList nodes={children} activeId={activeId} />
          </ul>
        )}
      </li>,
    ];
  });

  return <ul className="space-y-1.5 text-sm">{items}</ul>;
}
