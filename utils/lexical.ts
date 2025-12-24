import {
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

function shouldRemoveList(editor: LexicalEditor, type: "bullet" | "number") {
  let remove = false;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      remove = false;
      return;
    }
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
    if ($isListNode(element)) {
      remove = element.getListType() === type;
    }
  });
  return remove;
}

export function toggleListCommand(
  editor: LexicalEditor,
  type: "bullet" | "number",
) {
  const remove = shouldRemoveList(editor, type);
  editor.dispatchCommand(
    remove
      ? REMOVE_LIST_COMMAND
      : type === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
    undefined,
  );
  editor.focus();
}
