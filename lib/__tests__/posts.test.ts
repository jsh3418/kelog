import { getAllPosts, getPostSlugs } from "@/lib/posts";
import { describe, expect, it } from "vitest";

describe("getPostSlugs", () => {
  it("content/posts 디렉토리에서 .mdx 파일의 슬러그를 추출한다", () => {
    const slugs = getPostSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs.every((s) => !s.endsWith(".mdx"))).toBe(true);
  });
});

describe("getAllPosts", async () => {
  const posts = await getAllPosts();

  it("모든 포스트가 필수 필드를 갖추고 날짜 내림차순으로 정렬된다", () => {
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.slug).not.toBe("");
      expect(post.title).not.toBe("");
      expect(post.description).not.toBe("");
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });
});
