"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { LexicalEditor } from "lexical";

type ActiveEditorContextValue = {
  activeEditor: LexicalEditor | null;
  setActiveEditor: Dispatch<SetStateAction<LexicalEditor | null>>;
};

const ActiveEditorContext = createContext<ActiveEditorContextValue | null>(
  null,
);

export function ActiveEditorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeEditor, setActiveEditor] = useState<LexicalEditor | null>(null);

  const value = useMemo(
    () => ({
      activeEditor,
      setActiveEditor,
    }),
    [activeEditor],
  );

  return (
    <ActiveEditorContext.Provider value={value}>
      {children}
    </ActiveEditorContext.Provider>
  );
}

export function useActiveEditor() {
  const context = useContext(ActiveEditorContext);
  if (!context) {
    throw new Error("useActiveEditor must be used within ActiveEditorProvider");
  }
  return context;
}
