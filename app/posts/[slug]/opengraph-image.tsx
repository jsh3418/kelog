import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "kelog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamicParams = false;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { metadata } = await import(`@/content/posts/${slug}.mdx`);

  const geist = await readFile(
    join(
      process.cwd(),
      "fonts/Geist-Regular.ttf",
    ),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
        padding: "80px",
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontFamily: "Geist",
          color: "#09090b",
          textAlign: "center",
          lineHeight: 1.3,
          wordBreak: "keep-all",
        }}
      >
        {metadata.title}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geist,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
