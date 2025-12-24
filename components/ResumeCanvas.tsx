"use client";

import type { CSSProperties } from "react";
import RGL, { type Layout } from "react-grid-layout";
import { Move } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { ResumeItemContent } from "@/components/ResumeItemContent";
import { Watermark } from "@/components/Watermark";
import { resolveItemBackground } from "@/utils/color";
import type { ResumeData } from "@/types/resume";
import { GRID_COLS, GRID_ROW_HEIGHT } from "@/utils/resume";
import { WATERMARK_SAFE_BOTTOM_PX } from "@/utils/pageSize";
import {
  DEFAULT_CELL_PADDING_PX,
  DEFAULT_CELL_RADIUS_PX,
  IMAGE_CELL_PADDING_PX,
} from "@/utils/editorStyles";

type ResumeCanvasProps = {
  resumeData: ResumeData;
  selectedItemId?: string | null;
  layout?: Layout[];
  currentColumns?: number;
  currentRowHeight?: number;
  scaledCanvasWidth?: number;
  scaledCanvasHeight?: number;
  innerCanvasWidth?: number;
  innerCanvasHeight?: number;
  layoutMarginPx?: number;
  printMaskPadding?: string;
  overlapIds?: Set<string>;
  onLayoutChange?: (layout: Layout[]) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
  onSelectItem?: (itemId: string) => void;
  onContentChange?: (itemId: string, newHtml: string) => void;
};

const EMPTY_OVERLAP_IDS = new Set<string>();
const noop = () => {};
const noopLayout = () => {};
const noopSelectItem = () => {};
const noopContentChange = () => {};

export default function ResumeCanvas({
  resumeData,
  selectedItemId = null,
  layout = [],
  currentColumns = GRID_COLS,
  currentRowHeight = GRID_ROW_HEIGHT,
  scaledCanvasWidth = 0,
  scaledCanvasHeight = 0,
  innerCanvasWidth = 0,
  innerCanvasHeight = 0,
  layoutMarginPx = 0,
  printMaskPadding,
  overlapIds = EMPTY_OVERLAP_IDS,
  onLayoutChange = noopLayout,
  onDragStart = noop,
  onDragStop = noop,
  onResizeStart = noop,
  onResizeStop = noop,
  onSelectItem = noopSelectItem,
  onContentChange = noopContentChange,
}: ResumeCanvasProps) {
  return (
    <div className="overflow-x-auto">
      <PageContainer
        width={scaledCanvasWidth}
        height={scaledCanvasHeight}
        style={{
          fontFamily: resumeData.layout_settings.font_family,
          fontSize: `${resumeData.layout_settings.font_size_pt}pt`,
          color: resumeData.layout_settings.accent_color,
          paddingTop: `${resumeData.layout_settings.margin_px}px`,
          paddingRight: `${resumeData.layout_settings.margin_px}px`,
          paddingBottom: `${
            resumeData.layout_settings.margin_px +
            (resumeData.layout_settings.enable_watermark
              ? WATERMARK_SAFE_BOTTOM_PX
              : 0)
          }px`,
          paddingLeft: `${resumeData.layout_settings.margin_px}px`,
        }}
      >
        <RGL
          className="h-full w-full"
          layout={layout}
          cols={currentColumns}
          rowHeight={currentRowHeight}
          compactType={null}
          preventCollision
          draggableHandle=".rgl-drag-handle"
          draggableCancel=".text-item-editor"
          width={innerCanvasWidth}
          autoSize={false}
          style={{ height: "100%" }}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          maxRows={Math.floor(innerCanvasHeight / currentRowHeight)}
          onLayoutChange={onLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
        >
          {resumeData.items.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isOverlapped = overlapIds.has(item.id);
            const { color: resolvedBackgroundColor, hasBackground: hasCustomBackground } =
              resolveItemBackground(item.style);
            const borderColor = isOverlapped
              ? "#ef4444"
              : isSelected
                ? "#a855f7"
                : hasCustomBackground
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(226, 232, 240, 0.9)";
            const isSectionTitle = item.type === "section_title";
            const isInteractive = isSelected || isOverlapped;

            const cellStyle: CSSProperties = {
              padding:
                item.type === "image"
                  ? `${IMAGE_CELL_PADDING_PX}px`
                  : `${DEFAULT_CELL_PADDING_PX}px`,
              backgroundColor: isSectionTitle
                ? "transparent"
                : hasCustomBackground
                  ? (resolvedBackgroundColor ?? undefined)
                  : undefined,
              ["--cell-bg" as unknown as string]: isSectionTitle
                ? "transparent"
                : resolvedBackgroundColor ?? "rgba(255,255,255,0.92)",
              borderColor,
              borderStyle: hasCustomBackground ? "solid" : "dashed",
              borderWidth: isInteractive ? 2 : 1,
              borderRadius: `${DEFAULT_CELL_RADIUS_PX}px`,
              transition:
                "border 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            };

            return (
              <div
                key={item.id}
                className={`group relative h-full w-full border text-sm text-zinc-900 shadow-sm transition-all hover-glass ${
                  item.type === "image" ? "overflow-hidden" : ""
                } ${
                  isOverlapped
                    ? "ring-2 ring-red-400 active-glass"
                    : isSelected
                      ? "ring-2 ring-kawaii-purple/40 active-glass"
                      : ""
                }`}
                onMouseDownCapture={() => onSelectItem(item.id)}
                onFocus={() => onSelectItem(item.id)}
                tabIndex={0}
                style={cellStyle}
              >
                {isOverlapped && (
                  <div className="absolute left-2 top-2 rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] text-white shadow">
                    重叠
                  </div>
                )}
                <div className="rgl-drag-handle absolute -top-1.5 right-0.5 flex items-center justify-center w-4 h-4 rounded-[6px] border border-zinc-300 bg-white/90 text-zinc-500 shadow-sm cursor-move">
                  <Move size={9} />
                </div>

                <ResumeItemContent
                  item={item}
                  layoutSettings={resumeData.layout_settings}
                  onContentChange={onContentChange}
                />
              </div>
            );
          })}
        </RGL>
        <div
          className="print-mask"
          style={{ padding: printMaskPadding ?? `${layoutMarginPx}px` }}
        />
        {resumeData.layout_settings.enable_watermark && <Watermark />}
      </PageContainer>
    </div>
  );
}
