"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import type { LayoutSettings } from "@/types/resume";
import { Select, SelectItem, Slider, Input, Button, type Selection } from "@heroui/react";

import { Droplets, Pipette } from "lucide-react";

type StylePanelProps = {
  settings: LayoutSettings;
  onSettingsChange: (newSettings: LayoutSettings) => void;
  selectedItemType: string | null;
  selectedItemFontSize: number | null;
  onSelectedItemFontSizeChange: (value: number) => void;
  selectedItemLineHeight?: number | null;
  onSelectedItemLineHeightChange?: (value: number) => void;
  selectedItemColor: string | null;
  onSelectedItemColorChange: (value: string) => void;
  selectedItemContent?: string | null;
  selectedItemFontFamily?: string | null;
  selectedItemBackgroundColor?: string | null;
  selectedItemBackgroundOpacity?: number | null;
  selectedDividerThickness?: number | null;
  selectedImageScalePercent?: number | null;
  selectedImageFocus?: { x: number; y: number } | null;
  onSelectedItemFontFamilyChange?: (value: string) => void;
  onBackgroundColorChange?: (value: string | null) => void;
  onBackgroundOpacityChange?: (value: number) => void;
  onDividerThicknessChange?: (value: number) => void;
  onFormatText?: (type: "bold" | "italic" | "underline") => void;
  onAlignElement?: (format: "left" | "center" | "right") => void;
  onListToggle?: (type: "bullet" | "number") => void;
  onImageZoomChange?: (scale: number) => void;
  onImageFocusChange?: (xPercent: number, yPercent: number) => void;
  onImageZoomReset?: () => void;
  selectedBorderRadius?: number | null;
  onBorderRadiusChange?: (value: number) => void;
};

type FontOption = {
  label: string;
  value: string;
};

const FONT_OPTIONS: FontOption[] = [
  {
    label: "Nunito",
    value:
      'var(--font-nunito), "Nunito", "Open Sans", "Noto Sans CJK SC", "WenQuanYi Zen Hei", sans-serif',
  },
  {
    label: "Open Sans",
    value:
      'var(--font-open-sans), "Open Sans", "Helvetica Neue", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
  {
    label: "Roboto Mono",
    value:
      'var(--font-roboto-mono), "Roboto Mono", "DejaVu Sans Mono", "FreeMono", monospace',
  },
  {
    label: "Noto Sans CJK",
    value:
      'var(--font-noto-sans-sc), "Noto Sans CJK SC", "Noto Sans", "WenQuanYi Zen Hei", "Microsoft YaHei", sans-serif',
  },
  {
    label: "WenQuanYi Zen Hei",
    value:
      'var(--font-wqy-zenhei), "WenQuanYi Zen Hei", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
  {
    label: "DejaVu Serif",
    value:
      '"DejaVu Serif", "FreeSerif", serif',
  },
];

const PASTEL_PALETTE = [
  "#f5e8ff",
  "#ffe6f0",
  "#fff7d6",
  "#e7fbff",
  "#e3f4f4",
  "#f0e4ff",
  "#ffe5d9",
  "#fef2ff",
  "#def7ec",
  "#fef9c3",
];

export function StylePanel({
  settings,
  onSettingsChange,
  selectedItemType,
  selectedItemFontSize,
  onSelectedItemFontSizeChange,
  selectedItemLineHeight,
  onSelectedItemLineHeightChange,
  selectedItemColor,
  onSelectedItemColorChange,
  selectedItemContent,
  selectedItemFontFamily,
  selectedItemBackgroundColor,
  selectedItemBackgroundOpacity,
  selectedDividerThickness,
  selectedImageScalePercent,
  selectedImageFocus,
  onSelectedItemFontFamilyChange,
  onBackgroundColorChange,
  onBackgroundOpacityChange,
  onDividerThicknessChange,
  onFormatText,
  onAlignElement,
  onListToggle,
  onImageZoomChange,
  onImageFocusChange,
  onImageZoomReset,
  selectedBorderRadius,
  onBorderRadiusChange,
}: StylePanelProps) {
  const handleChange = (
    key: "accent_color" | "font_family" | "font_size_pt",
    value: string,
  ) => {
    const nextValue = key === "font_size_pt" ? Number(value) : value;
    onSettingsChange({
      ...settings,
      [key]: nextValue,
    });
  };

  const activeFontFamily = selectedItemFontFamily ?? settings.font_family;
  const fontOptions = useMemo(() => {
    if (!activeFontFamily) {
      return FONT_OPTIONS;
    }
    const exists = FONT_OPTIONS.some((option) => option.value === activeFontFamily);
    if (exists) {
      return FONT_OPTIONS;
    }
    return [
      ...FONT_OPTIONS,
      {
        label: activeFontFamily,
        value: activeFontFamily,
      },
    ];
  }, [activeFontFamily]);
  const selectedFontKey =
    activeFontFamily ||
    FONT_OPTIONS[0]?.value ||
    "";

  const handleFontSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const currentKey = (keys as unknown as { currentKey?: string }).currentKey;
    const val =
      currentKey ?? Array.from(keys as Set<string>)[0] ?? selectedFontKey;
    if (onSelectedItemFontFamilyChange) {
      onSelectedItemFontFamilyChange(val);
      return;
    }
    handleChange("font_family", val);
  };

  const handleBlockColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectedItemColorChange(event.target.value);
  };

  const isTextSelected =
    selectedItemType === "text" || selectedItemType === "section_title";
  const isSectionTitleSelected = selectedItemType === "section_title";
  const isDividerSelected = selectedItemType === "divider";
  const isImageSelected = selectedItemType === "image" && typeof selectedItemContent === "string" && selectedItemContent.length > 0;
  const currentColor = selectedItemColor ?? settings.accent_color ?? "#1f2937";
  const normalizedBackgroundColor = selectedItemBackgroundColor?.toLowerCase() ?? null;
  const backgroundOpacityPercent =
    typeof selectedItemBackgroundOpacity === "number"
      ? Math.round(selectedItemBackgroundOpacity * 100)
      : 0;
  const isCustomBackground = Boolean(
    normalizedBackgroundColor &&
      !PASTEL_PALETTE.some((color) => color.toLowerCase() === normalizedBackgroundColor),
  );
  const dividerThicknessValue = selectedDividerThickness ?? 2;
  const imageScalePercent = selectedImageScalePercent ?? 100;
  const imageFocus = selectedImageFocus ?? { x: 50, y: 50 };
  const lineHeightPercent = Math.round(((selectedItemLineHeight ?? 1.2)) * 100);
  const handleRGBChange = (event: ChangeEvent<HTMLInputElement>, channel: "r" | "g" | "b") => {
    const curr = currentColor;
    const m = curr.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
    let r = m ? parseInt(m[1]) : 0;
    let g = m ? parseInt(m[2]) : 0;
    let b = m ? parseInt(m[3]) : 0;
    const val = Math.max(0, Math.min(255, parseInt(event.target.value || "0")));
    if (channel === "r") r = val;
    if (channel === "g") g = val;
    if (channel === "b") b = val;
    onSelectedItemColorChange?.(`rgb(${r}, ${g}, ${b})`);
  };

  // 图片预览与焦点拖拽
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);
  const [isDraggingFocus, setIsDraggingFocus] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const customColorInputRef = useRef<HTMLInputElement | null>(null);
  const colorInputValue = useMemo(() => {
    if (!selectedItemBackgroundColor) {
      return "#ffffff";
    }
    const trimmed = selectedItemBackgroundColor.trim();
    const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed);
    return isHex ? trimmed : "#ffffff";
  }, [selectedItemBackgroundColor]);

  useEffect(() => {
    if (!isImageSelected || !selectedItemContent) {
      setImagePreviewURL(null);
      return;
    }
    setImagePreviewURL(selectedItemContent);
  }, [isImageSelected, selectedItemContent]);

  const handlePreviewMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    setIsDraggingFocus(true);
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100;
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * 100;
    onImageFocusChange?.(Math.round(x), Math.round(y));
  };
  const handlePreviewMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingFocus || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100;
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * 100;
    onImageFocusChange?.(Math.round(x), Math.round(y));
  };
  const handlePreviewMouseUp = () => setIsDraggingFocus(false);

  const handleBackgroundOpacityChange = (value: number | number[]) => {
    if (typeof value === "number") {
      onBackgroundOpacityChange?.(value / 100);
    }
  };

  const handleTransparentBackground = () => {
    onBackgroundColorChange?.(null);
  };

  const handlePipetteClick = () => {
    customColorInputRef.current?.click();
  };

  return (
    <div className="p-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">样式设置</h2>

        <div className="mt-4 space-y-5 text-sm">
          {selectedItemType ? (
            <div className="space-y-3 rounded-2xl border border-kawaii-pinkLight/30 bg-transparent p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-kawaii-purple">
                <span className="flex items-center gap-1 uppercase tracking-wide">
                  <Droplets size={14} />
                  Background & Effects
                </span>
                <span className="text-kawaii-text/60">{backgroundOpacityPercent}%</span>
              </div>
              <Slider
                aria-label="背景不透明度"
                minValue={0}
                maxValue={100}
                step={1}
                value={backgroundOpacityPercent}
                onChange={handleBackgroundOpacityChange}
              />
              <div className="space-y-2">
                <div className="text-xs font-medium text-zinc-500">Background Color</div>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={handleTransparentBackground}
                    className={`h-9 w-9 rounded-2xl border transition-all ${!normalizedBackgroundColor ? "ring-2 ring-kawaii-purple/70 border-kawaii-purple/40" : "border-zinc-200 hover:scale-105"}`}
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    }}
                    aria-label="透明底色"
                    title="透明底色"
                  />
                  {PASTEL_PALETTE.map((color) => {
                    const isActive = normalizedBackgroundColor === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => onBackgroundColorChange?.(color)}
                        className={`h-9 w-9 rounded-2xl border transition-all ${isActive ? "ring-2 ring-kawaii-purple/70 border-kawaii-purple/30" : "border-transparent hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                        aria-label={`选择底色 ${color}`}
                        title={color}
                      />
                    );
                  })}
                  <button
                    type="button"
                    onClick={handlePipetteClick}
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition-all ${isCustomBackground ? "ring-2 ring-kawaii-purple/70 border-kawaii-purple/30" : "border-zinc-200 hover:scale-105"}`}
                    aria-label="自定义颜色"
                    title="自定义颜色"
                  >
                    <Pipette size={16} className="text-kawaii-purple" />
                  </button>
                </div>
                <div className="text-[11px] font-semibold text-kawaii-text/70">
                  {selectedItemBackgroundColor ?? "透明"}
                </div>
              </div>
              <input
                ref={customColorInputRef}
                type="color"
                className="hidden"
                value={colorInputValue}
                onChange={(event) => onBackgroundColorChange?.(event.target.value)}
              />
            </div>
          ) : null}
          {isTextSelected ? (
            <div className="flex flex-col gap-2">
              <Select
                label="字体"
                selectedKeys={
                  selectedFontKey
                    ? (new Set([selectedFontKey]) as Selection)
                    : undefined
                }
                onSelectionChange={handleFontSelectionChange}
                className="rounded-2xl"
              >
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} textValue={font.label}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </Select>
            </div>
          ) : null}

          {isTextSelected ? (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <Slider
                label="当前模块字号（pt）"
                minValue={8}
                maxValue={32}
                step={1}
                value={selectedItemFontSize ?? settings.font_size_pt}
                onChange={(val) =>
                  typeof val === "number" && onSelectedItemFontSizeChange(val)
                }
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedItemFontSize === null
                  ? "点击右侧模块后可调整该模块字号"
                  : `当前：${selectedItemFontSize} pt`}
              </div>
              <Slider
                label="行高（%）"
                minValue={100}
                maxValue={200}
                step={1}
                value={lineHeightPercent}
                onChange={(val) =>
                  typeof val === "number" && onSelectedItemLineHeightChange?.(Math.round(val) / 100)
                }
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {`${lineHeightPercent}%`}
              </div>
            </div>
          ) : null}

          {(isTextSelected || isDividerSelected) ? (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">颜色</label>
              <div className="grid grid-cols-8 gap-2">
                {PASTEL_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onSelectedItemColorChange(c)}
                    className={`h-6 w-6 rounded-full border ${selectedItemColor === c ? "ring-2 ring-kawaii-purple" : "ring-0"}`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleBlockColorChange(e as unknown as ChangeEvent<HTMLInputElement>)}
                  className="h-10 w-12 rounded-2xl"
                />
                {isDividerSelected && (
                  <>
                    <Input label="R" type="number" min={0} max={255} className="w-16" onChange={(e) => handleRGBChange(e as unknown as ChangeEvent<HTMLInputElement>, "r")} />
                    <Input label="G" type="number" min={0} max={255} className="w-16" onChange={(e) => handleRGBChange(e as unknown as ChangeEvent<HTMLInputElement>, "g")} />
                    <Input label="B" type="number" min={0} max={255} className="w-16" onChange={(e) => handleRGBChange(e as unknown as ChangeEvent<HTMLInputElement>, "b")} />
                  </>
                )}
              </div>
            </div>
          ) : null}

          {isSectionTitleSelected ? (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <Slider
                label="顶部圆角（px）"
                minValue={0}
                maxValue={24}
                step={1}
                value={selectedBorderRadius ?? 0}
                onChange={(val) =>
                  typeof val === "number" && onBorderRadiusChange?.(val)
                }
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                当前：{selectedBorderRadius ?? 0}px
              </div>
            </div>
          ) : null}

          {!selectedItemType && (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="h-20 w-20 rounded-full bg-kawaii-purpleLight" />
              <div className="text-sm font-bold text-kawaii-text/80">未选中任何模块</div>
              <div className="text-xs text-kawaii-text/60">点击画布上的模块以编辑样式，或从左侧添加新模块</div>
            </div>
          )}

          {selectedItemType === "text" ? (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="flex items-center gap-2">
                <Button radius="full" variant="bordered" size="sm" onPress={() => onFormatText?.("bold")}>B</Button>
                <Button radius="full" variant="bordered" size="sm" onPress={() => onFormatText?.("italic")}>I</Button>
                <Button radius="full" variant="bordered" size="sm" onPress={() => onFormatText?.("underline")}>U</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button radius="full" variant="bordered" size="sm" onPress={() => onListToggle?.("bullet")}>• List</Button>
                <Button radius="full" variant="bordered" size="sm" onPress={() => onListToggle?.("number")}>1. List</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button radius="full" variant="bordered" size="sm" onPress={() => onAlignElement?.("left")}>左</Button>
                <Button radius="full" variant="bordered" size="sm" onPress={() => onAlignElement?.("center")}>中</Button>
                <Button radius="full" variant="bordered" size="sm" onPress={() => onAlignElement?.("right")}>右</Button>
              </div>
            </div>
          ) : null}

          {isDividerSelected ? (
            <div className="mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <Slider
                label="分割线粗细（px）"
                minValue={1}
                maxValue={10}
                step={1}
                value={dividerThicknessValue}
                onChange={(val) =>
                  typeof val === "number" && onDividerThicknessChange?.(val)
                }
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                当前：{dividerThicknessValue}px
              </div>
            </div>
          ) : null}

          {isImageSelected ? (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">图片缩放</label>
              <Slider
                label="缩放比例（%）"
                minValue={50}
                maxValue={200}
                step={1}
                value={imageScalePercent}
                onChange={(val) =>
                  typeof val === "number" &&
                  onImageZoomChange?.(Math.round(val) / 100)
                }
              />
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>当前：{imageScalePercent}%</span>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => onImageZoomReset?.()}
                >
                  重置缩放
                </Button>
              </div>
              <div
                ref={previewRef}
                onMouseDown={handlePreviewMouseDown}
                onMouseMove={handlePreviewMouseMove}
                onMouseUp={handlePreviewMouseUp}
                className="relative h-32 w-full overflow-hidden rounded-2xl border border-kawaii-pinkLight bg-zinc-50"
                style={{
                  backgroundImage: imagePreviewURL ? `url(${imagePreviewURL})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "crosshair",
                }}
              >
                <div
                  className="absolute h-2 w-2 -translate-x-1 -translate-y-1 rounded-full bg-kawaii-purple shadow"
                  style={{ left: `${imageFocus.x}%`, top: `${imageFocus.y}%` }}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent" />
              </div>
              <div className="text-xs text-zinc-500">当前焦点：{imageFocus.x}% / {imageFocus.y}% ，拖拽预览更新焦点</div>
            </div>
          ) : null}
        </div>
      </div>
  );
}
