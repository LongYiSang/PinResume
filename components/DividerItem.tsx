"use client";

import type { CSSProperties } from "react";

type DividerItemProps = {
  style?: CSSProperties;
};

export function DividerItem({ style }: DividerItemProps) {
  return (
    <div className="flex h-full w-full items-center">
      <hr
        className="w-full border-0"
        style={{
          borderTop: "2px solid #d4d4d8",
          margin: "8px 0",
          width: "100%",
          ...style,
        }}
      />
    </div>
  );
}
