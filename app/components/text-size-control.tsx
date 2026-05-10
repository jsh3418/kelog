"use client";

import {
  DEFAULT_TEXT_SIZE,
  parseTextSize,
  TEXT_SIZE_OPTIONS,
  TEXT_SIZE_STORAGE_KEY,
  type TextSize,
} from "@/lib/text-size";
import { useEffect, useSyncExternalStore } from "react";

const TEXT_SIZE_CHANGE_EVENT = "kelog:text-size-change";

const applyTextSize = (size: TextSize) => {
  const root = document.documentElement;

  if (size === DEFAULT_TEXT_SIZE) {
    root.removeAttribute("data-text-size");
    root.style.removeProperty("--kelog-text-scale");
    return;
  }

  root.dataset.textSize = size.toString();
  root.style.setProperty(
    "--kelog-text-scale",
    String(size / DEFAULT_TEXT_SIZE),
  );
};

const getStoredTextSize = (): TextSize => {
  try {
    return parseTextSize(window.localStorage.getItem(TEXT_SIZE_STORAGE_KEY));
  } catch {
    return DEFAULT_TEXT_SIZE;
  }
};

const subscribeTextSize = (onStoreChange: () => void) => {
  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(TEXT_SIZE_CHANGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(TEXT_SIZE_CHANGE_EVENT, handleChange);
  };
};

export function TextSizeControl() {
  const textSize = useSyncExternalStore(
    subscribeTextSize,
    getStoredTextSize,
    () => DEFAULT_TEXT_SIZE,
  );

  useEffect(() => {
    applyTextSize(textSize);
  }, [textSize]);

  function selectTextSize(size: TextSize) {
    applyTextSize(size);

    try {
      window.localStorage.setItem(TEXT_SIZE_STORAGE_KEY, size.toString());
    } catch {
      // Storage can be unavailable, but the current page should still update.
    }
    window.dispatchEvent(new Event(TEXT_SIZE_CHANGE_EVENT));
  }

  return (
    <>
      <button
        type="button"
        aria-label="텍스트 크기 설정"
        popoverTarget="text-size-options"
        className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold leading-5 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
      >
        Aa
      </button>

      <div
        id="text-size-options"
        popover="auto"
        style={{
          inset: "auto",
          top: "anchor(bottom)",
          right: "anchor(right)",
        }}
        className="w-40 rounded-md border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      >
        <p
          id="text-size-options-label"
          className="px-1 pb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400"
        >
          텍스트 크기
        </p>
        <div
          aria-labelledby="text-size-options-label"
          className="grid grid-cols-2 gap-1"
        >
          {TEXT_SIZE_OPTIONS.map((size) => {
            const selected = textSize === size;

            return (
              <button
                key={size}
                type="button"
                aria-current={selected}
                className={`rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500 ${
                  selected
                    ? "bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
                onClick={() => selectTextSize(size)}
              >
                {size}px
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
