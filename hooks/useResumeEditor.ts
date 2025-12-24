"use client";

import { useCallback, useRef, useState } from "react";
import type { Layout } from "react-grid-layout";
import { useRefState } from "@/hooks/useRefState";
import {
  deepCloneResumeData,
  isLayoutChanged,
} from "@/utils/resumeItemUtils";
import type { ResumeData } from "@/types/resume";

const MAX_HISTORY = 5;

export function useResumeEditor() {
  const [resumeData, setResumeData, resumeDataRef] =
    useRefState<ResumeData | null>(null);
  const [historyStack, setHistoryStack, historyRef] =
    useRefState<ResumeData[]>([]);
  const [redoStack, setRedoStack, redoRef] = useRefState<ResumeData[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const interactionStartSnapshotRef = useRef<ResumeData | null>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  const appendHistorySnapshot = useCallback(
    (snapshot: ResumeData) => {
      setHistoryStack((hs) => {
        const next = [...hs, deepCloneResumeData(snapshot)];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    },
    [setHistoryStack],
  );

  const recordHistorySnapshot = useCallback(
    (snapshot: ResumeData) => {
      appendHistorySnapshot(snapshot);
      setRedoStack([]);
    },
    [appendHistorySnapshot, setRedoStack],
  );

  const withHistory = useCallback(
    (updater: (prev: ResumeData) => ResumeData) => {
      setResumeData((prev) => {
        if (!prev) {
          return prev;
        }
        recordHistorySnapshot(prev);
        return updater(prev);
      });
    },
    [recordHistorySnapshot, setResumeData],
  );

  const handleUndo = useCallback(() => {
    const curr = resumeDataRef.current;
    const hs = historyRef.current;
    if (!curr || hs.length === 0) return;
    const prevState = hs[hs.length - 1];
    setHistoryStack(hs.slice(0, -1));
    setRedoStack((rs) => [...rs, deepCloneResumeData(curr)]);
    setResumeData(deepCloneResumeData(prevState));
  }, [historyRef, resumeDataRef, setHistoryStack, setRedoStack, setResumeData]);

  const handleRedo = useCallback(() => {
    const curr = resumeDataRef.current;
    const rs = redoRef.current;
    if (!curr || rs.length === 0) return;
    const nextState = rs[rs.length - 1];
    setRedoStack(rs.slice(0, -1));
    appendHistorySnapshot(curr);
    setResumeData(deepCloneResumeData(nextState));
  }, [resumeDataRef, redoRef, setRedoStack, appendHistorySnapshot, setResumeData]);

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      const ok = window.confirm("确认要删除该模块吗？此操作不可撤销。");
      if (!ok) return;
      withHistory((prev) => {
        const nextItems = prev.items.filter((i) => i.id !== itemId);
        return { ...prev, items: nextItems };
      });
      setSelectedItemId((curr) => (curr === itemId ? null : curr));
    },
    [withHistory],
  );

  const replaceResumeData = useCallback(
    (nextData: ResumeData) => {
      setResumeData((prev) => {
        if (prev) {
          recordHistorySnapshot(prev);
        } else {
          setRedoStack([]);
        }
        return deepCloneResumeData(nextData);
      });
    },
    [recordHistorySnapshot, setResumeData, setRedoStack],
  );

  const resetEditorState = useCallback(
    (nextData: ResumeData | null) => {
      setResumeData(nextData ? deepCloneResumeData(nextData) : null);
      setHistoryStack([]);
      setRedoStack([]);
      setSelectedItemId(null);
    },
    [setHistoryStack, setRedoStack, setResumeData, setSelectedItemId],
  );

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setResumeData((prev) => {
        if (!prev) {
          return prev;
        }

        const dragging = isDraggingRef.current;

        const updatedItems = prev.items.map((item) => {
          const nextLayout = newLayout.find((layoutItem) => layoutItem.i === item.id);
          if (!nextLayout) {
            return item;
          }

          const { x, y, w, h } = nextLayout;
          if (dragging) {
            return {
              ...item,
              layout: {
                ...item.layout,
                x,
                y,
                w: item.layout?.w ?? w,
                h: item.layout?.h ?? h,
              },
            };
          }

          return {
            ...item,
            layout: {
              ...item.layout,
              x,
              y,
              w,
              h,
            },
          };
        });

        return { ...prev, items: updatedItems };
      });
    },
    [setResumeData],
  );

  const handleContentChange = useCallback(
    (itemId: string, newHtml: string) => {
      withHistory((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.id === itemId ? { ...item, content: newHtml } : item,
        );
        return { ...prev, items: updatedItems };
      });
    },
    [withHistory],
  );

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    interactionStartSnapshotRef.current = resumeDataRef.current
      ? deepCloneResumeData(resumeDataRef.current)
      : null;
  }, [resumeDataRef]);

  const handleDragStop = useCallback(() => {
    isDraggingRef.current = false;
    const start = interactionStartSnapshotRef.current;
    const curr = resumeDataRef.current;
    interactionStartSnapshotRef.current = null;
    if (start && curr && isLayoutChanged(start, curr)) {
      recordHistorySnapshot(start);
    }
  }, [recordHistorySnapshot, resumeDataRef]);

  const handleResizeStart = useCallback(() => {
    isResizingRef.current = true;
    interactionStartSnapshotRef.current = resumeDataRef.current
      ? deepCloneResumeData(resumeDataRef.current)
      : null;
  }, [resumeDataRef]);

  const handleResizeStop = useCallback(() => {
    isResizingRef.current = false;
    const start = interactionStartSnapshotRef.current;
    const curr = resumeDataRef.current;
    interactionStartSnapshotRef.current = null;
    if (start && curr && isLayoutChanged(start, curr)) {
      recordHistorySnapshot(start);
    }
  }, [recordHistorySnapshot, resumeDataRef]);

  return {
    resumeData,
    setResumeData,
    resumeDataRef,
    historyStack,
    redoStack,
    historyRef,
    redoRef,
    selectedItemId,
    setSelectedItemId,
    withHistory,
    handleUndo,
    handleRedo,
    handleDeleteItem,
    replaceResumeData,
    resetEditorState,
    handleLayoutChange,
    handleContentChange,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
  };
}
