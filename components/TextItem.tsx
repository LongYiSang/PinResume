"use client";

import {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { mergeRegister } from "@lexical/utils";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import {
  $createParagraphNode,
  $getRoot,
  $isDecoratorNode,
  $isElementNode,
  type EditorState,
  type LexicalEditor,
  type LexicalNode,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
} from "lexical";
import { useActiveEditor } from "@/context/ActiveEditorContext";
import { sanitizeLexicalHtml } from "@/utils/sanitize-html";

const DEFAULT_HTML = "<p></p>";

function parseHtmlToNodes(editor: LexicalEditor, html: string): LexicalNode[] {
  const parser = new DOMParser();
  const normalized = html && html.length > 0 ? html : DEFAULT_HTML;
  const safeHtml = sanitizeLexicalHtml(normalized) || DEFAULT_HTML;
  const dom = parser.parseFromString(safeHtml, "text/html");
  const generatedNodes = $generateNodesFromDOM(editor, dom);
  if (generatedNodes.length === 0) {
    return [$createParagraphNode()];
  }

  return generatedNodes.map((node) => {
    if ($isElementNode(node) || $isDecoratorNode(node)) {
      return node;
    }
    const paragraph = $createParagraphNode();
    paragraph.append(node);
    return paragraph;
  });
}

type TextItemProps = {
  html: string;
  style?: CSSProperties;
  onChange?: (newHtml: string) => void;
  readOnly?: boolean;
};

type ExternalHtmlSyncPluginProps = {
  html: string;
  lastSyncedHtmlRef: MutableRefObject<string>;
};

function ExternalHtmlSyncPlugin({
  html,
  lastSyncedHtmlRef,
}: ExternalHtmlSyncPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const safeHtml = sanitizeLexicalHtml(html);
    if (safeHtml === lastSyncedHtmlRef.current) {
      return;
    }

    editor.update(() => {
      const nodes = parseHtmlToNodes(editor, safeHtml);
      const root = $getRoot();
      root.clear();
      nodes.forEach((node) => root.append(node));
      root.selectEnd();
    });

    lastSyncedHtmlRef.current = safeHtml;
  }, [editor, html, lastSyncedHtmlRef]);

  return null;
}

function FocusTrackerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setActiveEditor } = useActiveEditor();

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setActiveEditor(editor);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        (event) => {
          const nextTarget = event?.relatedTarget as HTMLElement | null;
          if (nextTarget?.closest?.("[data-top-toolbar='true']")) {
            editor.focus();
            return false;
          }
          setActiveEditor((current) => (current === editor ? null : current));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
    return () => {
      unregister();
      setActiveEditor((current) => (current === editor ? null : current));
    };
  }, [editor, setActiveEditor]);

  return null;
}

function TextItemReadOnly({ html, style }: { html: string; style?: CSSProperties }) {
  const safeHtml = useMemo(() => sanitizeLexicalHtml(html), [html]);
  return (
    <div
      className="text-item-readonly pointer-events-none select-none"
      style={style}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

function TextItemEditable({ html, style, onChange }: { html: string; style?: CSSProperties; onChange: (newHtml: string) => void }) {
  const initialHtmlRef = useRef(sanitizeLexicalHtml(html));
  const lastSyncedHtmlRef = useRef(sanitizeLexicalHtml(html));
  const [isFocused, setIsFocused] = useState(false);
  const initialConfig = useMemo(
    () => ({
      namespace: "text-item-editor",
      editable: true,
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
      theme: {},
      onError(error: Error) {
        console.error("Lexical error:", error);
        throw error;
      },
      editorState: (editor: LexicalEditor) => {
        const nodes = parseHtmlToNodes(editor, initialHtmlRef.current);
        const root = $getRoot();
        root.clear();
        nodes.forEach((node) => root.append(node));
      },
    }),
    [],
  );
  const handleEditorChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        const safeHtml = sanitizeLexicalHtml(htmlString);
        if (safeHtml === lastSyncedHtmlRef.current) {
          return;
        }
        lastSyncedHtmlRef.current = safeHtml;
        onChange(safeHtml);
      });
    },
    [onChange],
  );
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={`h-full w-full p-0 transition-all ${isFocused ? "ring-1 ring-blue-500" : "ring-1 ring-transparent"}`}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="text-item-editor"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{ ...style, backgroundColor: "transparent" }}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin onChange={handleEditorChange} />
        <FocusTrackerPlugin />
        <ExternalHtmlSyncPlugin html={html} lastSyncedHtmlRef={lastSyncedHtmlRef} />
      </div>
    </LexicalComposer>
  );
}

export function TextItem({ html, style, onChange, readOnly = false }: TextItemProps) {
  if (readOnly || !onChange) {
    return <TextItemReadOnly html={html} style={style} />;
  }
  return <TextItemEditable html={html} style={style} onChange={onChange} />;
}
