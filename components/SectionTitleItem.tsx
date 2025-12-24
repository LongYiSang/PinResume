"use client";

import type { CSSProperties } from "react";
import { TextItem } from "@/components/TextItem";

type SectionTitleItemProps = {
  html: string;
  style?: CSSProperties;
  onChange?: (newHtml: string) => void;
  readOnly?: boolean;
  accentColor?: string; // 主题色，用于背景和线条
};

export function SectionTitleItem({
  html,
  style,
  onChange,
  readOnly = false,
  accentColor = "#000000",
}: SectionTitleItemProps) {
  const backgroundColor = style?.backgroundColor ?? accentColor;
  const isTransparent = backgroundColor === "transparent";
  const lineColor = style?.borderColor ?? (isTransparent ? accentColor : backgroundColor);
  const textColor = style?.color ?? (isTransparent ? accentColor : "#ffffff");

  // 从 style 中剔除会导致冲突或不应应用在容器上的属性
  // 尤其是 borderColor 与 border: "none" 混用会导致 React 报错
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    borderColor: _borderColor,
    border,
    borderTop,
    borderBottom,
    borderLeft,
    borderRight,
    borderWidth,
    borderStyle,
    backgroundColor: _backgroundColor,
    ...restStyle
  } = style || {};

  // 容器样式：继承定位、宽高
  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-end", // 底部对齐
    width: "100%",
    height: "100%",
    ...restStyle,
    // 重置一些可能干扰 Flex 布局的样式
    backgroundColor: "transparent", // 容器背景透明
    border: "none",
    padding: 0,
  };

  // 文字块样式
  const textBlockStyle: CSSProperties = {
    backgroundColor: isTransparent ? "transparent" : backgroundColor,
    color: textColor,
    padding: "0 6px",
    minWidth: "100px",
    flexShrink: 0,
    position: "relative",
    borderTopLeftRadius: style?.borderTopLeftRadius,
    borderTopRightRadius: style?.borderTopRightRadius,
    zIndex: 1,
  };

  // 线条样式
  const lineStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    borderTop: `1px solid ${lineColor}`,
    zIndex: 0,
    pointerEvents: "none",
  };

  // 传递给 TextItem 的样式
  // 我们强制 TextItem 背景透明，颜色继承
  const textItemStyle: CSSProperties = {
    color: "inherit",
    backgroundColor: "transparent",
    fontSize: style?.fontSize,
    fontFamily: style?.fontFamily,
    lineHeight: style?.lineHeight ?? 1.2,
    fontWeight: "bold",
    margin: 0,
    minHeight: 0,
    height: "auto",
    display: "inline-block",
  };

  return (
    <div style={{ ...containerStyle, position: "relative" }} className="section-title-container">
      <div style={{ ...textBlockStyle }}>
        <TextItem
          html={html}
          style={textItemStyle}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
      <div style={lineStyle} />
    </div>
  );
}
