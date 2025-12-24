"use client";

import type { CSSProperties } from "react";
import { TextItem } from "@/components/TextItem";
import { SectionTitleItem } from "@/components/SectionTitleItem";
import { DividerItem } from "@/components/DividerItem";
import { ImageItem } from "@/components/ImageItem";
import type { LayoutSettings, ResumeItem } from "@/types/resume";

type ResumeItemContentProps = {
  item: ResumeItem;
  layoutSettings: LayoutSettings;
  readOnly?: boolean;
  mode?: "editor" | "print";
  onContentChange?: (itemId: string, newHtml: string) => void;
};

export function ResumeItemContent({
  item,
  layoutSettings,
  readOnly = false,
  mode = "editor",
  onContentChange,
}: ResumeItemContentProps) {
  const baseTextStyle: CSSProperties = {
    fontSize: `${layoutSettings.font_size_pt}pt`,
    color: layoutSettings.accent_color,
    ...(item.style ?? {}),
  };

  if (mode === "print") {
    baseTextStyle.whiteSpace = "pre-wrap";
    baseTextStyle.overflowWrap = "anywhere";
    baseTextStyle.wordBreak = "break-word";
    baseTextStyle.overflow = "visible";
    baseTextStyle.paddingRight = "2px";
  }

  if (item.type === "text") {
    return (
      <TextItem
        html={item.content}
        style={baseTextStyle}
        readOnly={readOnly}
        onChange={
          readOnly || !onContentChange
            ? undefined
            : (newHtml) => onContentChange(item.id, newHtml)
        }
      />
    );
  }

  if (item.type === "section_title") {
    return (
      <SectionTitleItem
        html={item.content}
        style={baseTextStyle}
        readOnly={readOnly}
        accentColor={layoutSettings.accent_color}
        onChange={
          readOnly || !onContentChange
            ? undefined
            : (newHtml) => onContentChange(item.id, newHtml)
        }
      />
    );
  }

  if (item.type === "divider") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { borderColor: _dc, color: _dcolor, ...restDivider } =
      (item.style ?? {}) as Record<string, unknown>;
    return <DividerItem style={restDivider as CSSProperties | undefined} />;
  }

  if (item.type === "image") {
    return (
      <ImageItem
        src={item.content}
        style={item.style as CSSProperties | undefined}
      />
    );
  }

  return (
    <div className="text-xs text-red-500">暂不支持的类型：{item.type}</div>
  );
}
