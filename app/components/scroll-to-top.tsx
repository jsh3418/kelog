"use client";

import { smoothScrollTo } from "@/lib/scroll";
import { useSyncExternalStore } from "react";

const SHOW_THRESHOLD = 200;

const subscribeScroll = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
};

const getIsScrolled = () => window.scrollY > SHOW_THRESHOLD;

export function ScrollToTop() {
  const isScrolled = useSyncExternalStore(
    subscribeScroll,
    getIsScrolled,
    () => false,
  );

  return (
    <button
      type="button"
      aria-label="최상단으로 이동"
      inert={!isScrolled}
      onClick={() => smoothScrollTo({ top: 0 })}
      className={`fixed bottom-6 right-6 z-50 cursor-pointer rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-600 shadow-lg hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
        isScrolled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
