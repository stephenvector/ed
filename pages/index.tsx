import { useCallback, useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

type LinkElement = {
  start: number;
  end: number;
  href: string;
  openInNewWindow: boolean;
};

type InlineElement = LinkElement;

type ParagraphState = {
  content: string;
  inlineElements: InlineElement[];
  focused: boolean;
};

type ParagraphKeydownAction = {
  action: "keydown";
  key: string;
};

type ParagraphFocusAction = {
  action: "focus";
};

type ParagraphBlurAction = {
  action: "blur";
};

type ParagraphAction =
  | ParagraphKeydownAction
  | ParagraphFocusAction
  | ParagraphBlurAction;

function editorReducer(state: ParagraphState, action: ParagraphAction) {
  if (action.action === "blur") {
    return {
      ...state,
      focused: false,
    };
  }

  if (action.action === "focus") {
    return {
      ...state,
      focused: true,
    };
  }

  return state;
}

const INITIAL_STATE: ParagraphState = {
  content: "this is some test content",
  inlineElements: [
    {
      start: 0,
      end: 10,
      href: "http://google.com/",
      openInNewWindow: false,
    },
  ],
  focused: false,
};

function EditableParagraph() {
  const [state, dispatch] = useReducer(editorReducer, INITIAL_STATE);

  const handleSelectionChange = useCallback(() => {
    console.log(document.getSelection());
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  return (
    <p
      contentEditable
      onBlur={() => {
        dispatch({ action: "blur" });
      }}
      onFocus={() => {
        dispatch({ action: "focus" });
      }}
      onChange={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log((e.target as HTMLParagraphElement).innerHTML);
      }}
      suppressContentEditableWarning={true}
    >
      {state.content}
    </p>
  );
}

// Listen to events:
// keydown
// contenteditable input
// send events to reducer
// update content in reducer

// https://github.com/satya164/react-simple-code-editor/blob/master/src/index.js

enum BlockType {
  Text = "#text",
  Paragraph = "p",
  PreCode = "precode",
}

type ParagraphBlock = {
  uuid: string;
  type: BlockType.Paragraph;
  content: string;
};

type PreCodeBlock = {
  content: string;
  type: BlockType.PreCode;
  uuid: string;
  language: string;
};

type ParentBlock = ParagraphBlock | PreCodeBlock;

const DEFAULT_VALUE: ParentBlock[] = [
  {
    uuid: uuidv4(),
    type: BlockType.PreCode,
    language: "typescript",
    content: "function helloWorld() {}",
  },
];

export default function Editor() {
  const [parentBlocks, setParentBlocks] =
    useState<ParentBlock[]>(DEFAULT_VALUE);

  return (
    <div>
      <Link href="/selection-coordinates">
        <a>Selection Coordinates</a>
      </Link>
      <hr />
      <EditableParagraph />
      <hr />
      {parentBlocks.map((b) => {
        if (b.type === BlockType.PreCode) {
          return (
            <textarea
              style={{ width: "500px", minHeight: "300px" }}
              key={b.uuid}
              onChange={(e) => {
                setParentBlocks(
                  parentBlocks.map((p) => {
                    if (p.uuid === b.uuid || p.type !== BlockType.PreCode) {
                      return p;
                    }

                    return {
                      ...p,
                      content: e.target.value,
                    };
                  })
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const { value, selectionStart, selectionEnd } =
                    e.target as HTMLTextAreaElement;
                  if (selectionStart === selectionEnd) {
                    const newValue = `${value.substring(
                      0,
                      selectionStart
                    )}\t${value.substring(selectionStart)}`;
                    parentBlocks.map((p) => {
                      if (p.uuid === b.uuid || p.type !== BlockType.PreCode) {
                        return p;
                      }

                      return {
                        ...p,
                        content: newValue,
                      };
                    });
                  }
                } else {
                  setParentBlocks(
                    parentBlocks.map((p) => {
                      if (p.uuid === b.uuid || p.type !== BlockType.PreCode) {
                        return p;
                      }

                      return {
                        ...p,
                        content: (e.target as HTMLTextAreaElement).value,
                      };
                    })
                  );
                }
              }}
              value={b.content}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
