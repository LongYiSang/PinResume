import type {
  ResumeData,
  ResumeItem,
  ResumeItemStyle,
} from "@/types/resume";
import { GRID_COLS } from "@/utils/resume";

type SimplifiedLayout = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const DEFAULT_DIVIDER_THICKNESS = 2;
const DEFAULT_BACKGROUND_OPACITY = 0.7;

export { DEFAULT_DIVIDER_THICKNESS, DEFAULT_BACKGROUND_OPACITY };

export function parseFontSizeValue(value: unknown, fallback: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function extractDividerThickness(style?: ResumeItemStyle): number | null {
  if (!style) {
    return null;
  }
  const borderTop = style.borderTop;
  if (typeof borderTop === "string") {
    const match = borderTop.match(/([\d.]+)px/);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  const borderWidth = style.borderWidth;
  if (typeof borderWidth === "number" && !Number.isNaN(borderWidth)) {
    return borderWidth;
  }
  if (typeof borderWidth === "string") {
    const parsed = parseFloat(borderWidth);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function extractDividerColor(style?: ResumeItemStyle): string | null {
  if (!style) {
    return null;
  }
  const borderTop = style.borderTop;
  if (typeof borderTop === "string") {
    const colorMatches = borderTop.match(
      /(#[0-9a-fA-F]{3,8}|rgba?\([^\)]+\)|hsla?\([^\)]+\)|[a-zA-Z]+)/g,
    );
    if (colorMatches && colorMatches.length > 0) {
      const filtered = colorMatches.filter(
        (token) =>
          !["solid", "dashed", "double", "none"].includes(token.toLowerCase()),
      );
      if (filtered.length > 0) {
        return filtered[filtered.length - 1];
      }
    }
  }
  if (typeof style.borderColor === "string") {
    return style.borderColor;
  }
  if (typeof style.color === "string") {
    return style.color;
  }
  return null;
}

export function parseScaleFromTransform(transformValue?: unknown): number | null {
  if (typeof transformValue !== "string") {
    return null;
  }
  const match = transformValue.match(/scale\(([^)]+)\)/i);
  if (!match) {
    return null;
  }
  const parsed = parseFloat(match[1]);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

export function parsePositionPercent(
  value?: unknown,
): { x: number; y: number } | null {
  if (typeof value !== "string") {
    return null;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2) {
    return null;
  }
  const parsePart = (part: string) => {
    if (part.endsWith("%")) {
      const num = parseFloat(part.slice(0, -1));
      if (!Number.isNaN(num)) {
        return Math.max(0, Math.min(100, num));
      }
    }
    return null;
  };
  const x = parsePart(parts[0]);
  const y = parsePart(parts[1]);
  if (x === null || y === null) {
    return null;
  }
  return { x, y };
}

export function parseBackgroundOpacity(value: unknown): number | null {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return Math.max(0, Math.min(1, value));
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return Math.max(0, Math.min(1, parsed));
    }
  }
  return null;
}

export function deepCloneResumeData(data: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(data)) as ResumeData;
}

export function simplifiedLayouts(data: ResumeData | null): SimplifiedLayout[] {
  if (!data) return [];
  return data.items
    .map((it) => ({
      id: it.id,
      x: it.layout?.x ?? 0,
      y: it.layout?.y ?? 0,
      w: it.layout?.w ?? 0,
      h: it.layout?.h ?? 0,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function isLayoutChanged(a: ResumeData | null, b: ResumeData | null): boolean {
  const sa = simplifiedLayouts(a);
  const sb = simplifiedLayouts(b);
  return JSON.stringify(sa) !== JSON.stringify(sb);
}

export function computeCenteredPosition(prev: ResumeData, w: number, h: number): { x: number; y: number } {
  const cols = prev.layout_settings?.columns ?? GRID_COLS;
  const x = Math.max(0, Math.min(cols - w, Math.floor((cols - w) / 2)));
  const usedHeight = prev.items.reduce((max, it) => {
    const ly = it.layout;
    const bottom = (ly?.y ?? 0) + (ly?.h ?? 0);
    return Math.max(max, bottom);
  }, 0);
  const y = Math.max(0, Math.floor(usedHeight / 2) - Math.floor(h / 2));
  return { x, y };
}

export function calcOverlapIds(items: ResumeItem[]): Set<string> {
  const ids = new Set<string>();
  const rects = items.map((it) => {
    const x = it.layout?.x ?? 0;
    const y = it.layout?.y ?? 0;
    const w = it.layout?.w ?? 0;
    const h = it.layout?.h ?? 0;
    return { id: it.id, left: x, right: x + w, top: y, bottom: y + h };
  });
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      const sepH = a.right <= b.left || b.right <= a.left;
      const sepV = a.bottom <= b.top || b.bottom <= a.top;
      if (!(sepH || sepV)) {
        ids.add(a.id);
        ids.add(b.id);
      }
    }
  }
  return ids;
}
