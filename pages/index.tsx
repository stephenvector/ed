import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// https://github.com/satya164/react-simple-code-editor/blob/master/src/index.js

enum BlockType {
  Text = "#text",
  Paragraph = "p",
  PreCode = "precode",
  Link = "link",
}

type TextBlock = {
  type: BlockType.Text;
  content: string;
  uuid: string;
};

type LinkBlock = {
  type: BlockType.Link;
  content: string;
  href: string;
};

type ParagraphBlock = {
  uuid: string;
  type: BlockType.Paragraph;
  content: (TextBlock | LinkBlock)[];
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
                        content: e.target.value,
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
