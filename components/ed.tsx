import { useCallback, useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

enum InlineType {
  Link = "link",
  Italic = "italic",
}

type LinkElement = {
  type: InlineType.Link;
  start: number;
  end: number;
  uuid: string;
  href: string;
};

type ItalicElement = {
  type: InlineType.Italic;
  start: number;
  uuid: string;
  end: number;
};

type InlineElement = LinkElement | ItalicElement;

type ParagraphState = {
  content: string;
  inlineElements: InlineElement[];
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
      type: InlineType.Link,
      uuid: uuidv4(),
    },
  ],
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

export function paragraphStateToHtml(p: ParagraphState) {
  if (p.inlineElements.length === 0) {
    return p.content;
  }

  return p.content;
}

export function max(a: number, b: number) {
  if (a >= b) return a;
  return b;
}

export function min(a: number, b: number) {
  if (a <= b) return a;
  return b;
}

export function getNewLinkElement(start: number, end: number): LinkElement {
  return {
    type: InlineType.Link,
    href: "",
    start: min(start, end),
    end: max(start, end),
    uuid: uuidv4(),
  };
}

export function getNewItalicElement(start: number, end: number): ItalicElement {
  return {
    type: InlineType.Italic,
    start: min(start, end),
    end: max(start, end),
    uuid: uuidv4(),
  };
}

/**
 * Converts a start & end value into a an array for all integers between the
 * two numbers:
 *
 * Example:
 *
 * arrayFromRange(4,9) => [4,5,6,7,8,9]
 *
 * @param start number
 * @param end number
 * @returns number[]
 */
export function getArrayFromRange(start: number, end: number) {
  const s = min(start, end);
  const e = max(start, end);

  const values: number[] = [];

  for (let i = s; i <= e; i++) {
    values.push(i);
  }

  return values;
}

// Merge inline elements so that they don't overlap
// example:
//  link: 3,10
//  italic: 7,15
//  underline: 2,12
//
// ...llllllll........
// .......iiiiiiiii...
// ..uuuuuuuuuuu......
//
// ...llllllll | ........
// .......iiii | iiiii...
// ..uuuuuuuuu | uu......
//
// ... | llll | llll | .. | ......
// ... | .... | iiii | ii | iii...
// ..u | uuuu | uuuu | uu | ......

export function mergeInlineElements(inlineElements: InlineElement[]) {
  const values: Record<number, string[]> = {};

  inlineElements.forEach((inlineElement) => {
    const arrayFromRange = getArrayFromRange(
      inlineElement.start,
      inlineElement.end
    );

    arrayFromRange.forEach((index) => {
      if (!(index in values)) {
        values[index] = [inlineElement.uuid];
      } else {
        values[index].push(inlineElement.uuid);
      }
    });
  });

  console.log(values);
}

mergeInlineElements([getNewLinkElement(0, 10), getNewItalicElement(4, 14)]);

function addInlineElement(
  inlineElements: InlineElement[],
  newInlineElement: InlineElement
): InlineElement[] {
  // inlineElements.forEach(inlineElement => {
  // if (inlineElement.type !== inlineElement)
  // })?
  return [...inlineElements, newInlineElement];
}

export default function Ed() {
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
