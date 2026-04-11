"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeColorSync() {
  const pathname = usePathname();

  useEffect(() => {
    const apply = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();

      document
        .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
        .forEach((meta) => {
          meta.content = color;
        });
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
