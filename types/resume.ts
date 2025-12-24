export type LayoutSettings = {
  accent_color: string;
  font_family: string;
  font_size_pt: number;
  columns: number;
  row_height_px: number;
  margin_px: number;
  enable_watermark?: boolean;
  [key: string]: unknown;
};

export type ResumeLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown;
};

export type ResumeItemStyle = {
  [key: string]: string | number | undefined;
  backgroundColor?: string;
  backgroundOpacity?: number;
};

export type ResumeItem = {
  id: string;
  type: string;
  content: string;
  layout: ResumeLayout;
  style: ResumeItemStyle;
  [key: string]: unknown;
};

export type ResumeData = {
  layout_settings: LayoutSettings;
  items: ResumeItem[];
};
