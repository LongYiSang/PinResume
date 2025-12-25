"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PageContainer } from "@/components/PageContainer";
import { ResumeItemContent } from "@/components/ResumeItemContent";
import type { ResumeData, ResumeItem } from "@/types/resume";

import { resolveItemBackground } from "@/utils/color";
import { DEFAULT_LAYOUT_SETTINGS, normalizeResumeContent } from "@/utils/resume";
import {
  DEFAULT_CELL_PADDING_PX,
  DEFAULT_CELL_RADIUS_PX,
  IMAGE_CELL_PADDING_PX,
} from "@/utils/editorStyles";
import { A4_HEIGHT_PX, A4_WIDTH_PX, WATERMARK_SAFE_BOTTOM_PX } from "@/utils/pageSize";
import { clearPrintData, loadPrintData } from "@/utils/printStorage";

import { Watermark } from "@/components/Watermark";

type ItemLayout = ResumeItem["layout"];

function resolveLayout(layout?: ItemLayout) {
  return {
    x: layout?.x ?? 0,
    y: layout?.y ?? 0,
    w: layout?.w ?? 4,
    h: layout?.h ?? 4,
  };
}

export function PrintView() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIsRendered(false);

    let cancelled = false;
    let resolved = false;
    let resolving = false;

    const finalizeRender = async (data: ResumeData) => {
      if (cancelled || resolved || resolving) return;
      resolving = true;
      setResumeData(data);

      const fontsReady = (document as unknown as { fonts?: { ready?: Promise<void> } }).fonts?.ready;
      if (fontsReady) {
        const timeout = new Promise<void>((resolve) =>
          setTimeout(resolve, 3000),
        );
        try {
          await Promise.race([fontsReady, timeout]);
        } catch {}
      }

      if (!cancelled) {
        resolved = true;
        setIsRendered(true);
        setIsLoading(false);
      }
    };

    const loadAndPrint = async () => {
      try {
        const payload = await loadPrintData();
        const normalized = payload ? normalizeResumeContent(payload.content) : null;
        if (!payload || !normalized) {
          setError("没有可打印的数据，请从编辑页重新打开。");
          setIsLoading(false);
          return;
        }
        document.title = payload.title || "简历";
        await finalizeRender(normalized);
        await clearPrintData();
      } catch (err) {
        console.error("加载打印数据失败", err);
        setError("加载打印数据失败，请重试。");
        setIsLoading(false);
      }
    };

    loadAndPrint();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isRendered) return;
    const timer = window.setTimeout(() => {
      try {
        window.print();
      } catch {}
    }, 300);
    return () => window.clearTimeout(timer);
  }, [isRendered]);

  const layoutSettings = useMemo(
    () => ({
      ...DEFAULT_LAYOUT_SETTINGS,
      ...(resumeData?.layout_settings ?? {}),
    }),
    [resumeData?.layout_settings],
  );
  const watermarkSafeBottomPx = layoutSettings.enable_watermark
    ? WATERMARK_SAFE_BOTTOM_PX
    : 0;

  const gridContainerStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${layoutSettings.columns}, 1fr)`,
      gridAutoRows: `${layoutSettings.row_height_px}px`,
      gap: "0px",
      width: "100%",
      height: "100%",
    }),
    [layoutSettings],
  );

  return (
    <div className="print-root min-h-screen bg-zinc-100 py-8">
      <PageContainer
        width={A4_WIDTH_PX}
        height={A4_HEIGHT_PX}
        style={{
          fontFamily: layoutSettings.font_family,
          fontSize: `${layoutSettings.font_size_pt}pt`,
          color: layoutSettings.accent_color,
          paddingTop: `${layoutSettings.margin_px}px`,
          paddingRight: `${layoutSettings.margin_px}px`,
          paddingBottom: `${layoutSettings.margin_px + watermarkSafeBottomPx}px`,
          paddingLeft: `${layoutSettings.margin_px}px`,
        }}
      >
        <div style={gridContainerStyle}>
          {resumeData?.items?.map((item) => {
            const resolvedLayout = resolveLayout(item.layout);
            const { color: resolvedBackgroundColor, hasBackground } =
              resolveItemBackground(item.style);
            const isSectionTitle = item.type === "section_title";
            const hasContainerBackground = !isSectionTitle && hasBackground;

            const rawBorder = (item.style as Record<string, unknown> | undefined)?.["border"];
            const rawBorderWidth = (item.style as Record<string, unknown> | undefined)?.["borderWidth"];
            const rawBorderColor = (item.style as Record<string, unknown> | undefined)?.["borderColor"];
            const borderWidth =
              typeof rawBorderWidth === "number"
                ? rawBorderWidth
                : typeof rawBorderWidth === "string"
                  ? Number.parseFloat(rawBorderWidth)
                  : undefined;
            const hasExplicitBorder =
              (typeof rawBorder === "string" && rawBorder.trim().length > 0) ||
              (typeof borderWidth === "number" && !Number.isNaN(borderWidth) && borderWidth > 0);
            const borderColor =
              typeof rawBorderColor === "string" && rawBorderColor.trim().length > 0
                ? rawBorderColor
                : undefined;
            const borderValue =
              typeof rawBorder === "string" && rawBorder.trim().length > 0
                ? (rawBorder as string)
                : hasExplicitBorder
                  ? `${Math.max(1, Math.round(borderWidth!))}px solid ${borderColor ?? "currentColor"}`
                  : "none";

            const baseCellStyle: CSSProperties = {
              gridColumn: `${resolvedLayout.x + 1} / span ${resolvedLayout.w}`,
              gridRow: `${resolvedLayout.y + 1} / span ${resolvedLayout.h}`,
              backgroundColor: hasContainerBackground
                ? resolvedBackgroundColor ?? "transparent"
                : "transparent",
              minWidth: 0,
              boxSizing: "border-box",
              border: borderValue,
            };
            const isImageItem = item.type === "image";
            const cellStyle: CSSProperties = {
              ...baseCellStyle,
              padding: isImageItem
                ? `${IMAGE_CELL_PADDING_PX}px`
                : `${DEFAULT_CELL_PADDING_PX}px`,
              borderRadius: `${DEFAULT_CELL_RADIUS_PX}px`,
              overflow: isImageItem ? "hidden" : "visible",
            };

            return (
              <div key={item.id} style={cellStyle}>
                <ResumeItemContent
                  item={item}
                  layoutSettings={layoutSettings}
                  readOnly
                  mode="print"
                />
              </div>
            );
          })}
        </div>
        {isRendered && <div id="pdf-render-ready" />}
        {layoutSettings.enable_watermark && <Watermark />}
      </PageContainer>

      <div className="mt-6 text-center text-sm text-zinc-500 print:hidden">
        {isLoading && "正在加载打印视图..."}
        {!isLoading && error && error}
      </div>
    </div>
  );
}
