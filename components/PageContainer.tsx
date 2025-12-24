"use client";

import type { CSSProperties, PropsWithChildren } from "react";

interface PageContainerProps extends PropsWithChildren {
  width?: number;
  height?: number;
  style?: CSSProperties;
}

export function PageContainer({
  children,
  width = 900,
  height = 1272,
  style,
}: PageContainerProps) {
  const baseStyle: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: "white",
    margin: "0 auto",
    position: "relative",
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    overflow: "hidden",
  };

  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
}
