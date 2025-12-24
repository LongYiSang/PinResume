import type { CSSProperties } from "react";

export const DEFAULT_CELL_RADIUS_PX = 22;
export const DEFAULT_CELL_PADDING_PX = 12;
export const IMAGE_CELL_PADDING_PX = 8;
export const DEFAULT_IMAGE_RADIUS_REM = "0.75rem";

export function buildImageStyle(style?: CSSProperties): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transformOrigin: "center",
    display: "block",
    borderRadius: DEFAULT_IMAGE_RADIUS_REM,
    ...style,
  };
}
