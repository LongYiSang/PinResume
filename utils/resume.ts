import type {
  LayoutSettings,
  ResumeData,
  ResumeItem,
  ResumeItemStyle,
  ResumeLayout,
} from "@/types/resume";

export const GRID_COLS = 24;
export const GRID_ROW_HEIGHT = 10;

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  columns: GRID_COLS,
  row_height_px: GRID_ROW_HEIGHT,
  accent_color: "#3388ff",
  font_family: "Arial",
  font_size_pt: 10,
  margin_px: 36,
};

function normalizeLayoutSettings(
  raw?: Record<string, unknown>,
): LayoutSettings {
  const source = (raw ?? {}) as Record<string, unknown>;
  const normalized: LayoutSettings = {
    ...DEFAULT_LAYOUT_SETTINGS,
    ...(source as Record<string, unknown>),
  } as LayoutSettings;

  normalized.columns =
    typeof source["columns"] === "number"
      ? (source["columns"] as number)
      : DEFAULT_LAYOUT_SETTINGS.columns;
  normalized.row_height_px =
    typeof source["row_height_px"] === "number"
      ? (source["row_height_px"] as number)
      : DEFAULT_LAYOUT_SETTINGS.row_height_px;
  normalized.accent_color =
    typeof source["accent_color"] === "string"
      ? (source["accent_color"] as string)
      : DEFAULT_LAYOUT_SETTINGS.accent_color;
  normalized.font_family =
    typeof source["font_family"] === "string"
      ? (source["font_family"] as string)
      : DEFAULT_LAYOUT_SETTINGS.font_family;
  normalized.font_size_pt =
    typeof source["font_size_pt"] === "number"
      ? (source["font_size_pt"] as number)
      : DEFAULT_LAYOUT_SETTINGS.font_size_pt;
  normalized.margin_px =
    typeof source["margin_px"] === "number"
      ? (source["margin_px"] as number)
      : DEFAULT_LAYOUT_SETTINGS.margin_px;

  return normalized;
}

function normalizeItemStyle(raw: unknown): ResumeItemStyle {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const style: ResumeItemStyle = {};
  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    if (key === "backgroundOpacity") {
      const parsed =
        typeof value === "number"
          ? value
          : typeof value === "string"
            ? Number.parseFloat(value)
            : Number.NaN;
      if (!Number.isNaN(parsed)) {
        style.backgroundOpacity = Math.max(0, Math.min(1, parsed));
      }
      return;
    }
    if (typeof value === "string" || typeof value === "number") {
      style[key] = value;
    }
  });
  return style;
}

export function normalizeResumeContent(content: unknown): ResumeData | null {
  if (!content) {
    return null;
  }

  let parsed: unknown = content;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch (err) {
      console.error("简历内容 JSON 解析失败", err);
      return null;
    }
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const draft = parsed as Record<string, unknown> & {
    items?: unknown;
    layout_settings?: Record<string, unknown>;
  };

  const itemsSource = Array.isArray(draft.items) ? draft.items : [];
  const layoutSettings = normalizeLayoutSettings(draft.layout_settings);

  const items: ResumeItem[] = itemsSource.map((raw, index) => {
    const item = (raw as Record<string, unknown>) ?? {};
    const layoutRaw = (item.layout as Record<string, unknown>) ?? {};

    const layout: ResumeLayout = {
      x: typeof layoutRaw.x === "number" ? layoutRaw.x : 0,
      y: typeof layoutRaw.y === "number" ? layoutRaw.y : 0,
      w: typeof layoutRaw.w === "number" ? layoutRaw.w : 4,
      h: typeof layoutRaw.h === "number" ? layoutRaw.h : 4,
    };

    const style = normalizeItemStyle(item.style);

    return {
      ...(item as Omit<ResumeItem, "id" | "layout" | "style" | "content">),
      id: typeof item.id === "string" ? item.id : `item-${index}`,
      type: typeof item.type === "string" ? item.type : "text",
      content: typeof item.content === "string" ? item.content : "",
      layout,
      style,
    };
  });

  return {
    layout_settings: layoutSettings,
    items,
  };
}
