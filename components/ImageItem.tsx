"use client";

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import { buildImageStyle } from "@/utils/editorStyles";

type ImageItemProps = {
  src?: string;
  style?: CSSProperties;
};

function InlineImage({
  src,
  style,
}: {
  src: string;
  style?: CSSProperties;
}) {
  const combinedStyle = buildImageStyle(style);
  return (
    <img
      src={src}
      alt="上传的图片"
      style={combinedStyle}
      className="pointer-events-none select-none"
    />
  );
}

export function ImageItem({ src, style }: ImageItemProps) {
  if (!src) {
    const combinedStyle = buildImageStyle(style);
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-md bg-zinc-100 text-xs text-zinc-500"
        style={combinedStyle}
      >
        无法加载图片
      </div>
    );
  }

  return <InlineImage src={src} style={style} />;
}
