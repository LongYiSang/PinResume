import type { ResumeItemStyle } from "@/types/resume";

const HEX_SHORTHAND_LENGTHS = new Set([3, 4]);

function expandHex(raw: string): string {
  if (!HEX_SHORTHAND_LENGTHS.has(raw.length)) {
    return raw;
  }
  return raw
    .split("")
    .map((ch) => ch + ch)
    .join("");
}

function parseHexColor(color: string): {
  r: number;
  g: number;
  b: number;
  a?: number;
} | null {
  const normalized = color.trim().replace(/^#/, "").toLowerCase();
  if (![3, 4, 6, 8].includes(normalized.length)) {
    return null;
  }
  const expanded = expandHex(normalized);
  const hasAlpha = expanded.length === 8;
  const base = hasAlpha ? expanded.slice(0, 6) : expanded;
  const r = Number.parseInt(base.slice(0, 2), 16);
  const g = Number.parseInt(base.slice(2, 4), 16);
  const b = Number.parseInt(base.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }
  const alpha = hasAlpha
    ? Number.parseInt(expanded.slice(6, 8), 16) / 255
    : undefined;
  return { r, g, b, a: alpha };
}

function parseRgbString(color: string): {
  r: number;
  g: number;
  b: number;
  a?: number;
} | null {
  const normalized = color.trim();
  const legacyMatch = normalized.match(/^rgba?\(([^)]+)\)$/i);
  if (!legacyMatch) {
    return null;
  }
  const parts = legacyMatch[1]
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (parts.length < 3) {
    return null;
  }
  const r = Number.parseFloat(parts[0]);
  const g = Number.parseFloat(parts[1]);
  const b = Number.parseFloat(parts[2]);
  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }
  const a = parts[3] !== undefined ? Number.parseFloat(parts[3]) : undefined;
  return { r, g, b, a };
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

export function applyOpacityToColor(
  color?: string,
  opacity?: number,
): string | undefined {
  if (!color) {
    return undefined;
  }
  if (typeof opacity !== "number" || Number.isNaN(opacity)) {
    return color;
  }
  const clampedOpacity = clamp01(opacity);
  const hex = parseHexColor(color);
  if (hex) {
    const alpha = hex.a ?? 1;
    return `rgba(${hex.r}, ${hex.g}, ${hex.b}, ${clampedOpacity * alpha})`;
  }
  const rgb = parseRgbString(color);
  if (rgb) {
    const alpha = rgb.a ?? 1;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity * alpha})`;
  }
  return color;
}

export function extractBackgroundStyle(style?: ResumeItemStyle): {
  color?: string;
  opacity?: number;
} {
  if (!style) {
    return {};
  }

  const rawColorInput =
    typeof style.backgroundColor === "string" && style.backgroundColor.trim().length > 0
      ? style.backgroundColor.trim()
      : undefined;
  const rawColor =
    rawColorInput && rawColorInput.toLowerCase() !== "transparent"
      ? rawColorInput
      : undefined;
  const rawOpacity =
    typeof style.backgroundOpacity === "number"
      ? style.backgroundOpacity
      : typeof style.backgroundOpacity === "string"
        ? Number.parseFloat(style.backgroundOpacity)
        : undefined;
  const opacity =
    typeof rawOpacity === "number" && !Number.isNaN(rawOpacity)
      ? clamp01(rawOpacity)
      : undefined;

  return {
    color: rawColor,
    opacity,
  };
}

export function resolveItemBackground(style?: ResumeItemStyle): {
  color?: string;
  hasBackground: boolean;
} {
  const meta = extractBackgroundStyle(style);
  return {
    color: applyOpacityToColor(meta.color, meta.opacity),
    hasBackground: Boolean(meta.color),
  };
}
