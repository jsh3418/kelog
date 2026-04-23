import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [["remark-gfm", { singleTilde: false }]],
    rehypePlugins: [
      "rehype-slug",
      "@stefanprobst/rehype-extract-toc",
      ["@stefanprobst/rehype-extract-toc/mdx", { name: "toc" }],
      [
        "rehype-pretty-code",
        {
          defaultLang: "text",
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
