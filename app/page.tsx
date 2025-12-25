"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { Layout } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import Inspector from "@/components/Inspector";
import Dock from "@/components/Dock";
import ResumeCanvas from "@/components/ResumeCanvas";
import { ActiveEditorProvider } from "@/context/ActiveEditorContext";
import { useAlertModal } from "@/context/AlertModalContext";
import { useItemStyleEditor } from "@/hooks/useItemStyleEditor";
import { useResumeEditor } from "@/hooks/useResumeEditor";
import { DEFAULT_LAYOUT_SETTINGS, GRID_COLS, GRID_ROW_HEIGHT, normalizeResumeContent } from "@/utils/resume";
import { calcOverlapIds, computeCenteredPosition } from "@/utils/resumeItemUtils";
import type { LayoutSettings, ResumeData, ResumeItem } from "@/types/resume";
import { DEFAULT_RESUME_DATA, DEFAULT_RESUME_TITLE } from "@/data/default-resume";
import { A4_HEIGHT_PX, A4_WIDTH_PX, WATERMARK_SAFE_BOTTOM_PX } from "@/utils/pageSize";
import { savePrintData } from "@/utils/printStorage";

const MAX_IMAGE_SIZE_MB = 5;

export default function Home() {
  const { showAlert } = useAlertModal();
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [title, setTitle] = useState(DEFAULT_RESUME_TITLE);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useResumeEditor();
  const styleEditor = useItemStyleEditor({
    selectedItemId: editor.selectedItemId,
    resumeData: editor.resumeData,
    withHistory: editor.withHistory,
  });

  const {
    resumeData,
    historyStack,
    redoStack,
    selectedItemId,
    withHistory,
    handleUndo,
    handleRedo,
    handleDeleteItem,
    resetEditorState,
    handleLayoutChange,
    handleContentChange,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    setSelectedItemId,
    setResumeData,
  } = editor;

  useEffect(() => {
    if (!resumeData) {
      resetEditorState(DEFAULT_RESUME_DATA);
    }
  }, [resetEditorState, resumeData]);

  const {
    selectedItem,
    selectedItemFontSize,
    selectedItemColor,
    selectedItemLineHeight,
    selectedItemFontFamily,
    selectedDividerThickness,
    selectedImageScalePercent,
    selectedImageFocus,
    selectedItemBackgroundColor,
    selectedItemBackgroundOpacity,
    selectedBorderRadius,
    handleItemFontSizeChange,
    handleItemColorChange,
    handleItemLineHeightChange,
    handleItemBackgroundColorChange,
    handleItemBackgroundOpacityChange,
    handleDividerThicknessChange,
    handleItemFontFamilyChange,
    handleBorderRadiusChange,
    handleImageZoomChange,
    handleImageFocusChange,
    handleImageZoomReset,
  } = styleEditor;

  const layout = useMemo<Layout[]>(() => {
    if (!resumeData) {
      return [];
    }

    return resumeData.items.map((item) => {
      const { layout: itemLayout } = item;
      return {
        i: item.id,
        x: itemLayout?.x ?? 0,
        y: itemLayout?.y ?? 0,
        w: itemLayout?.w ?? 4,
        h: itemLayout?.h ?? 4,
      };
    });
  }, [resumeData]);

  const handleSettingsChange = useCallback(
    (newSettings: LayoutSettings) => {
      withHistory((prev) => ({ ...prev, layout_settings: newSettings }));
    },
    [withHistory],
  );

  const currentColumns =
    resumeData?.layout_settings?.columns ?? GRID_COLS;
  const currentRowHeight =
    resumeData?.layout_settings?.row_height_px ?? GRID_ROW_HEIGHT;
  const layoutMarginPx =
    resumeData?.layout_settings?.margin_px ?? DEFAULT_LAYOUT_SETTINGS.margin_px;
  const watermarkSafeBottomPx =
    resumeData?.layout_settings?.enable_watermark ? WATERMARK_SAFE_BOTTOM_PX : 0;
  const scaledCanvasWidth = Math.round(A4_WIDTH_PX * zoom);
  const scaledCanvasHeight = Math.round(A4_HEIGHT_PX * zoom);
  const innerCanvasWidth = Math.max(0, scaledCanvasWidth - layoutMarginPx * 2);
  const innerCanvasHeight = Math.max(
    0,
    scaledCanvasHeight - layoutMarginPx * 2 - watermarkSafeBottomPx,
  );
  const printMaskPadding = `${layoutMarginPx}px ${layoutMarginPx}px ${
    layoutMarginPx + watermarkSafeBottomPx
  }px ${layoutMarginPx}px`;
  const overlapIds = useMemo(() => {
    if (!resumeData) return new Set<string>();
    return calcOverlapIds(resumeData.items);
  }, [resumeData]);

  const getResumeData = useCallback(
    (onMissing?: () => void): ResumeData | null => {
      if (!resumeData) {
        setError("简历内容尚未加载完成");
        onMissing?.();
        return null;
      }
      return resumeData;
    },
    [resumeData, setError],
  );

  const handleAddSectionTitle = useCallback(() => {
    const data = getResumeData();
    if (!data) return;
    const defaultW = 24;
    const defaultH = 3;
    const accentColor =
      data.layout_settings?.accent_color ??
      DEFAULT_LAYOUT_SETTINGS.accent_color;

    withHistory((prev) => {
      const pos = computeCenteredPosition(prev, defaultW, defaultH);
      const newItem: ResumeItem = {
        id: uuidv4(),
        type: "section_title",
        content: "分节标题",
        layout: { x: pos.x, y: pos.y, w: defaultW, h: defaultH },
        style: {
          fontSize: `${(prev.layout_settings?.font_size_pt ?? DEFAULT_LAYOUT_SETTINGS.font_size_pt) + 2}pt`,
          backgroundColor: accentColor,
          color: "#ffffff",
          borderColor: accentColor,
        },
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, [getResumeData, withHistory]);

  const handleAddText = useCallback(() => {
    if (!getResumeData()) return;
    const defaultW = 12;
    const defaultH = 6;
    withHistory((prev) => {
      const pos = computeCenteredPosition(prev, defaultW, defaultH);
      const newItem: ResumeItem = {
        id: uuidv4(),
        type: "text",
        content: "",
        layout: { x: pos.x, y: pos.y, w: defaultW, h: defaultH },
        style: {
          fontSize: `${prev.layout_settings?.font_size_pt ?? DEFAULT_LAYOUT_SETTINGS.font_size_pt}pt`,
          color: prev.layout_settings?.accent_color ?? DEFAULT_LAYOUT_SETTINGS.accent_color,
        },
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
  }, [getResumeData, withHistory]);

  const handleAddDivider = useCallback(() => {
    const data = getResumeData();
    if (!data) return;

    const accentColor =
      data.layout_settings?.accent_color ??
      DEFAULT_LAYOUT_SETTINGS.accent_color;

    withHistory((prev) => {
      const newDivider: ResumeItem = {
        id: uuidv4(),
        type: "divider",
        content: "",
        layout: { x: 0, y: 0, w: 24, h: 2 },
        style: {
          borderTop: `2px solid ${accentColor}`,
          margin: "8px 0",
        },
      };
      return { ...prev, items: [...prev.items, newDivider] };
    });
  }, [getResumeData, withHistory]);

  const appendImageItem = useCallback(
    (src: string) => {
      withHistory((prev) => {
        const newImage: ResumeItem = {
          id: uuidv4(),
          type: "image",
          content: src,
          layout: { x: 0, y: 0, w: 6, h: 10 },
          style: {
            borderRadius: "0.375rem",
            objectFit: "cover",
          },
        };
        return { ...prev, items: [...prev.items, newImage] };
      });
    },
    [withHistory],
  );

  const handleAddImageClick = useCallback(() => {
    if (!getResumeData()) return;
    fileInputRef.current?.click();
  }, [getResumeData]);

  const handleImageUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      if (!getResumeData(() => {
        event.target.value = "";
      })) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("请选择图片文件");
        event.target.value = "";
        return;
      }

      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > MAX_IMAGE_SIZE_MB) {
        setError(`图片过大，建议小于 ${MAX_IMAGE_SIZE_MB}MB`);
        event.target.value = "";
        return;
      }

      setError(null);
      setIsUploadingImage(true);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : null;
        if (!dataUrl) {
          setError("读取图片失败，请重试");
          return;
        }
        appendImageItem(dataUrl);
      };
      reader.onerror = () => {
        setError("读取图片失败，请重试");
      };
      reader.onloadend = () => {
        setIsUploadingImage(false);
        event.target.value = "";
      };
      reader.readAsDataURL(file);
    },
    [appendImageItem, getResumeData, setError],
  );

  const handleSelectItem = useCallback(
    (itemId: string) => {
      setSelectedItemId(itemId);
    },
    [setSelectedItemId],
  );

  const sanitizeFilename = (name: string) =>
    name.replace(/[\\/:*?"<>|]+/g, "_").trim() || "resume";

  const handleDownloadJson = useCallback(() => {
    const data = getResumeData();
    if (!data) return;
    const payload = {
      title: title.trim() || DEFAULT_RESUME_TITLE,
      content: data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${sanitizeFilename(payload.title)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [getResumeData, title]);

  const handleImportJsonClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportJson = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      setError(null);
      try {
        const raw = await file.text();
        const parsed = JSON.parse(raw);
        const content = parsed?.content ?? parsed;
        const normalized = normalizeResumeContent(content);
        if (!normalized) {
          throw new Error("invalid resume data");
        }
        resetEditorState(normalized);
        const nextTitle =
          typeof parsed?.title === "string" && parsed.title.trim()
            ? parsed.title.trim()
            : DEFAULT_RESUME_TITLE;
        setTitle(nextTitle);
      } catch (err) {
        console.error("导入失败", err);
        setError("导入失败，请检查 JSON 文件格式");
      } finally {
        event.target.value = "";
      }
    },
    [resetEditorState],
  );

  const handleNewResume = useCallback(() => {
    const data = getResumeData();
    if (!data) return;
    const ok = window.confirm("确认要清空当前内容并重置标题吗？此操作不可撤销。");
    if (!ok) return;
    resetEditorState({ ...data, items: [] });
    setTitle(DEFAULT_RESUME_TITLE);
  }, [getResumeData, resetEditorState, setTitle]);

  const handlePrint = useCallback(async () => {
    const data = getResumeData();
    if (!data) return;
    const payload = {
      title: title.trim() || DEFAULT_RESUME_TITLE,
      content: data,
    };
    try {
      const ok = await savePrintData(payload);
      if (!ok) {
        showAlert({
          title: "打印失败",
          message: "保存打印数据失败，可能是图片过大或浏览器存储已满。",
        });
        return;
      }
      const printUrl = new URL("print/", window.location.href).toString();
      const win = window.open(printUrl, "_blank");
      if (!win) {
        setError("无法打开打印窗口，请检查浏览器弹窗设置");
      }
    } catch (err) {
      console.error("打印失败", err);
      showAlert({
        title: "打印失败",
        message: "保存打印数据时发生错误，请重试。",
      });
    }
  }, [getResumeData, showAlert, title]);

  return (
    <ActiveEditorProvider>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="relative">
          <div className="fixed left-6 inset-y-0 z-40 flex items-center">
            <Dock
              onNewResume={handleNewResume}
              onAddText={handleAddText}
              onAddSectionTitle={handleAddSectionTitle}
              onAddImage={handleAddImageClick}
              onAddDivider={handleAddDivider}
              onToggleWatermark={() => {
                if (!resumeData) return;
                const newSettings = {
                  ...resumeData.layout_settings,
                  enable_watermark: !resumeData.layout_settings.enable_watermark,
                };
                setResumeData({
                  ...resumeData,
                  layout_settings: newSettings,
                });
              }}
              watermarkEnabled={resumeData?.layout_settings.enable_watermark}
              disabled={!resumeData}
              isUploadingImage={isUploadingImage}
            />
          </div>

          <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 w-80">
            {resumeData && (
              <Inspector
                title={title}
                onUpdateTitle={setTitle}
                onDownloadJson={handleDownloadJson}
                onImportJson={handleImportJsonClick}
                onPrint={handlePrint}
                historyCanUndo={historyStack.length > 0}
                historyCanRedo={redoStack.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                styleSettings={resumeData.layout_settings}
                onStyleSettingsChange={handleSettingsChange}
                selectedItemType={selectedItem?.type ?? null}
                selectedItemFontSize={
                  selectedItem?.type === "text" || selectedItem?.type === "section_title"
                    ? selectedItemFontSize
                    : null
                }
                onSelectedItemFontSizeChange={handleItemFontSizeChange}
                selectedItemColor={
                  selectedItem?.type === "text" || selectedItem?.type === "divider"
                    ? selectedItemColor
                    : null
                }
                onSelectedItemColorChange={handleItemColorChange}
                selectedItemLineHeight={
                  selectedItem?.type === "text" || selectedItem?.type === "section_title"
                    ? selectedItemLineHeight
                    : null
                }
                onSelectedItemLineHeightChange={handleItemLineHeightChange}
                selectedItemFontFamily={
                  selectedItem?.type === "text" || selectedItem?.type === "section_title"
                    ? selectedItemFontFamily
                    : null
                }
                onSelectedItemFontFamilyChange={handleItemFontFamilyChange}
                selectedDividerThickness={
                  selectedItem?.type === "divider" ? selectedDividerThickness : null
                }
                onDividerThicknessChange={handleDividerThicknessChange}
                selectedItemContent={selectedItem?.type === "image" ? selectedItem.content : null}
                selectedImageScalePercent={
                  selectedItem?.type === "image" ? selectedImageScalePercent : null
                }
                selectedImageFocus={
                  selectedItem?.type === "image" ? selectedImageFocus : null
                }
                selectedBorderRadius={selectedBorderRadius}
                selectedItemBackgroundColor={selectedItemBackgroundColor}
                selectedItemBackgroundOpacity={selectedItemBackgroundOpacity}
                onBackgroundColorChange={handleItemBackgroundColorChange}
                onBackgroundOpacityChange={handleItemBackgroundOpacityChange}
                onBorderRadiusChange={handleBorderRadiusChange}
                onImageZoomChange={handleImageZoomChange}
                onImageFocusChange={handleImageFocusChange}
                onImageZoomReset={handleImageZoomReset}
                onDeleteSelected={() => {
                  if (!selectedItemId) return;
                  handleDeleteItem(selectedItemId);
                }}
                zoom={zoom}
                setZoom={setZoom}
              />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportJson}
          />

          <div className="min-h-screen flex items-start justify-center px-[120px]">
            <div className="w-full max-w-5xl rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-card backdrop-blur-xl">
              {resumeData ? (
                <ResumeCanvas
                  resumeData={resumeData}
                  selectedItemId={selectedItemId}
                  layout={layout}
                  currentColumns={currentColumns}
                  currentRowHeight={currentRowHeight}
                  scaledCanvasWidth={scaledCanvasWidth}
                  scaledCanvasHeight={scaledCanvasHeight}
                  innerCanvasWidth={innerCanvasWidth}
                  innerCanvasHeight={innerCanvasHeight}
                  layoutMarginPx={layoutMarginPx}
                  printMaskPadding={printMaskPadding}
                  overlapIds={overlapIds}
                  onLayoutChange={handleLayoutChange}
                  onDragStart={handleDragStart}
                  onDragStop={handleDragStop}
                  onResizeStart={handleResizeStart}
                  onResizeStop={handleResizeStop}
                  onSelectItem={handleSelectItem}
                  onContentChange={handleContentChange}
                />
              ) : (
                <div className="py-10 text-center text-sm text-zinc-500">
                  正在加载布局...
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </ActiveEditorProvider>
  );
}
