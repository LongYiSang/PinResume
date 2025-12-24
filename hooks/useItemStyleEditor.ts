"use client";

import { useCallback } from "react";
import { DEFAULT_LAYOUT_SETTINGS } from "@/utils/resume";
import { extractBackgroundStyle } from "@/utils/color";
import {
  parseFontSizeValue,
  extractDividerThickness,
  extractDividerColor,
  parseScaleFromTransform,
  parsePositionPercent,
  parseBackgroundOpacity,
  DEFAULT_DIVIDER_THICKNESS,
  DEFAULT_BACKGROUND_OPACITY,
} from "@/utils/resumeItemUtils";
import type { ResumeData, ResumeItemStyle } from "@/types/resume";

type UseItemStyleEditorParams = {
  selectedItemId: string | null;
  resumeData: ResumeData | null;
  withHistory: (updater: (prev: ResumeData) => ResumeData) => void;
};

export function useItemStyleEditor({
  selectedItemId,
  resumeData,
  withHistory,
}: UseItemStyleEditorParams) {
  const selectedItem =
    resumeData && selectedItemId
      ? resumeData.items.find((item) => item.id === selectedItemId) ?? null
      : null;

  const selectedItemFontSize = (() => {
    if (!selectedItem || !resumeData?.layout_settings) {
      return null;
    }
    return parseFontSizeValue(
      selectedItem.style?.fontSize,
      resumeData.layout_settings.font_size_pt,
    );
  })();

  const selectedItemColor = (() => {
    if (!selectedItem || !resumeData?.layout_settings) {
      return null;
    }
    if (selectedItem.type === "divider") {
      return (
        extractDividerColor(selectedItem.style) ??
        resumeData.layout_settings.accent_color
      );
    }
    const rawColor = selectedItem.style?.color;
    if (typeof rawColor === "string" && rawColor.trim().length > 0) {
      return rawColor;
    }
    return resumeData.layout_settings.accent_color;
  })();

  const selectedItemLineHeight = (() => {
    if (!selectedItem || !resumeData?.layout_settings) {
      return null;
    }
    const raw = selectedItem.style?.lineHeight;
    if (typeof raw === "number" && !Number.isNaN(raw)) {
      return raw;
    }
    if (typeof raw === "string") {
      const parsed = parseFloat(raw);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return 1.2;
  })();

  const selectedItemFontFamily = (() => {
    if (
      !selectedItem ||
      (selectedItem.type !== "text" && selectedItem.type !== "section_title") ||
      !resumeData?.layout_settings
    ) {
      return null;
    }
    const rawFamily = selectedItem.style?.fontFamily;
    if (typeof rawFamily === "string" && rawFamily.trim().length > 0) {
      return rawFamily;
    }
    return resumeData.layout_settings.font_family;
  })();

  const selectedDividerThickness =
    selectedItem && selectedItem.type === "divider"
      ? extractDividerThickness(selectedItem.style) ?? DEFAULT_DIVIDER_THICKNESS
      : null;

  const selectedImageScalePercent = (() => {
    if (!selectedItem || selectedItem.type !== "image") {
      return null;
    }
    const scale = parseScaleFromTransform(selectedItem.style?.transform);
    if (!scale) {
      return 100;
    }
    return Math.round(scale * 100);
  })();

  const selectedImageFocus = (() => {
    if (!selectedItem || selectedItem.type !== "image") {
      return null;
    }
    return (
      parsePositionPercent(selectedItem.style?.objectPosition) ??
      parsePositionPercent((selectedItem.style as Record<string, unknown>)?.transformOrigin) ?? {
        x: 50,
        y: 50,
      }
    );
  })();

  const selectedItemBackgroundColor = (() => {
    if (!selectedItem) {
      return null;
    }
    const { color } = extractBackgroundStyle(selectedItem.style);
    return color ?? null;
  })();

  const selectedBorderRadius = (() => {
    if (!selectedItem || selectedItem.type !== "section_title") {
      return null;
    }
    const radius = selectedItem.style?.borderTopLeftRadius;
    if (typeof radius === "number") return radius;
    if (typeof radius === "string") return parseFloat(radius) || 0;
    return 0;
  })();

  const selectedItemBackgroundOpacity = (() => {
    if (!selectedItem) {
      return null;
    }
    const { opacity } = extractBackgroundStyle(selectedItem.style);
    return typeof opacity === "number" ? opacity : null;
  })();

  const handleItemFontSizeChange = useCallback(
    (newSizePt: number) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id !== selectedItemId
            ? item
            : {
                ...item,
                style: {
                  ...(item.style ?? {}),
                  fontSize: `${newSizePt}pt`,
                },
              },
        );
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleItemColorChange = useCallback(
    (newColor: string) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const accent =
          prev.layout_settings?.accent_color ?? DEFAULT_LAYOUT_SETTINGS.accent_color;
        const safeColor = newColor || accent;
        const updatedItems = prev.items.map((item) => {
          if (item.id !== selectedItemId) {
            return item;
          }
          if (item.type === "divider") {
            const nextThickness =
              extractDividerThickness(item.style) ?? DEFAULT_DIVIDER_THICKNESS;
            const nextStyle: ResumeItemStyle = {
              ...(item.style ?? {}),
            };
            delete (nextStyle as unknown as Record<string, unknown>)["borderColor"];
            delete (nextStyle as unknown as Record<string, unknown>)["color"];
            nextStyle.borderTop = `${nextThickness}px solid ${safeColor}`;
            return {
              ...item,
              style: nextStyle,
            };
          }
          return {
            ...item,
            style: {
              ...(item.style ?? {}),
              color: safeColor,
            },
          };
        });
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleItemLineHeightChange = useCallback(
    (nextLineHeight: number) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id !== selectedItemId
            ? item
            : {
                ...item,
                style: {
                  ...(item.style ?? {}),
                  lineHeight: nextLineHeight,
                },
              },
        );
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleItemBackgroundColorChange = useCallback(
    (newColor: string | null) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.id !== selectedItemId) {
            return item;
          }
          const nextStyle: ResumeItemStyle = {
            ...(item.style ?? {}),
          };
          const trimmed = newColor?.trim();
          if (!trimmed) {
            if (item.type === "section_title") {
              const accent =
                prev.layout_settings?.accent_color ?? DEFAULT_LAYOUT_SETTINGS.accent_color;
              nextStyle.backgroundColor = "transparent";
              delete nextStyle.backgroundOpacity;
              const currentTextColor = (nextStyle.color ?? "").toString().toLowerCase();
              const isWhite =
                currentTextColor === "#ffffff" ||
                currentTextColor === "white" ||
                currentTextColor.includes("rgb(255, 255, 255");
              if (!currentTextColor || isWhite) {
                nextStyle.color = accent;
              }
              if (!nextStyle.borderColor) {
                nextStyle.borderColor = accent;
              }
              return {
                ...item,
                style: nextStyle,
              };
            }
            delete nextStyle.backgroundColor;
            delete nextStyle.backgroundOpacity;
            return {
              ...item,
              style: nextStyle,
            };
          }
          const existingOpacity = parseBackgroundOpacity(nextStyle.backgroundOpacity);
          nextStyle.backgroundColor = trimmed;
          nextStyle.backgroundOpacity = existingOpacity ?? DEFAULT_BACKGROUND_OPACITY;

          if (item.type === "section_title") {
            nextStyle.borderColor = trimmed;
          }

          return {
            ...item,
            style: nextStyle,
          };
        });
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleItemBackgroundOpacityChange = useCallback(
    (nextOpacity: number) => {
      if (!selectedItemId) return;
      const clamped = Math.max(0, Math.min(1, nextOpacity));
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) => {
          if (item.id !== selectedItemId) {
            return item;
          }
          const nextStyle: ResumeItemStyle = {
            ...(item.style ?? {}),
          };
          nextStyle.backgroundOpacity = clamped;
          return {
            ...item,
            style: nextStyle,
          };
        });
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleDividerThicknessChange = useCallback(
    (nextThickness: number) => {
      if (!selectedItemId) return;
      const clamped = Math.max(1, Math.min(10, Math.round(nextThickness)));
      withHistory((prev) => {
        const accent =
          prev.layout_settings?.accent_color ?? DEFAULT_LAYOUT_SETTINGS.accent_color;
        const updatedItems = prev.items.map((item) => {
          if (item.id !== selectedItemId || item.type !== "divider") {
            return item;
          }
          const currentColor =
            extractDividerColor(item.style) ?? accent;
          const nextStyle: ResumeItemStyle = {
            ...(item.style ?? {}),
          };
          delete (nextStyle as unknown as Record<string, unknown>)["borderColor"];
          delete (nextStyle as unknown as Record<string, unknown>)["color"];
          nextStyle.borderTop = `${clamped}px solid ${currentColor}`;
          return {
            ...item,
            style: nextStyle,
          };
        });
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleItemFontFamilyChange = useCallback(
    (fontFamily: string) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id !== selectedItemId
            ? item
            : {
                ...item,
                style: {
                  ...(item.style ?? {}),
                  fontFamily,
                },
              },
        );
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleBorderRadiusChange = useCallback(
    (radius: number) => {
      if (!selectedItemId) return;
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id !== selectedItemId
            ? item
            : {
                ...item,
                style: {
                  ...(item.style ?? {}),
                  borderTopLeftRadius: radius,
                  borderTopRightRadius: radius,
                },
              },
        );
        return { ...prev, items: updatedItems };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleImageZoomChange = useCallback(
    (scale: number) => {
      if (!selectedItemId) return;
      const nextScale = Math.max(0.5, Math.min(2, scale));
      withHistory((prev) => {
        const updated = prev.items.map((item) => {
          if (item.id !== selectedItemId || item.type !== "image") {
            return item;
          }
          const existingOrigin =
            typeof item.style?.transformOrigin === "string"
              ? item.style.transformOrigin
              : typeof item.style?.objectPosition === "string"
                ? item.style.objectPosition
                : "50% 50%";
          return {
            ...item,
            style: {
              ...(item.style ?? {}),
              transform: `scale(${nextScale})`,
              transformOrigin: existingOrigin,
            },
          };
        });
        return { ...prev, items: updated };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleImageFocusChange = useCallback(
    (xPercent: number, yPercent: number) => {
      if (!selectedItemId) return;
      const nextX = Math.max(0, Math.min(100, Math.round(xPercent)));
      const nextY = Math.max(0, Math.min(100, Math.round(yPercent)));
      const nextValue = `${nextX}% ${nextY}%`;
      withHistory((prev) => {
        const updated = prev.items.map((item) =>
          item.id !== selectedItemId || item.type !== "image"
            ? item
            : {
                ...item,
                style: {
                  ...(item.style ?? {}),
                  objectPosition: nextValue,
                  transformOrigin: nextValue,
                },
              },
        );
        return { ...prev, items: updated };
      });
    },
    [selectedItemId, withHistory],
  );

  const handleImageZoomReset = useCallback(() => {
    if (!selectedItemId) return;
    withHistory((prev) => {
      const updated = prev.items.map((item) =>
        item.id !== selectedItemId || item.type !== "image"
          ? item
          : {
              ...item,
              style: {
                ...(item.style ?? {}),
                transform: "scale(1)",
                objectPosition: "50% 50%",
                transformOrigin: "50% 50%",
              },
            },
      );
      return { ...prev, items: updated };
    });
  }, [selectedItemId, withHistory]);

  return {
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
  };
}
