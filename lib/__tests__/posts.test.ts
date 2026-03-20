import { describe, it, expect } from "vitest";
import { getPostSlugs, getAllPosts } from "@/lib/posts";

describe("getPostSlugs", () => {
  it("content/posts 디렉토리에서 .mdx 파일의 슬러그를 추출한다", () => {
    const slugs = getPostSlugs();
    expect(slugs).toContain("hello-world");
    expect(slugs.every((s) => !s.endsWith(".mdx"))).toBe(true);
  });
});

describe("getAllPosts", () => {
  it("모든 포스트를 날짜 내림차순으로 반환한다", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post).toHaveProperty("slug");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("date");
    }

    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("hello-world 포스트의 메타데이터를 올바르게 반환한다", () => {
    const posts = getAllPosts();
    const hello = posts.find((p) => p.slug === "hello-world");
    expect(hello).toBeDefined();
    expect(hello!.title).toBe("Hello World: 첫 번째 포스트");
    expect(hello!.date).toBe("2026-03-20");
  });
});
