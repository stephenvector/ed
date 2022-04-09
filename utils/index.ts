import { v4 as uuidv4 } from "uuid";
import {
  LinkElement,
  ItalicElement,
  InlineElement,
  ParagraphState,
} from "../types";

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
    type: "link",
    uuid: uuidv4(),
    href: "",
    openInNewWindow: false,
    start: min(start, end),
    end: max(start, end),
  };
}

export function getNewItalicElement(start: number, end: number): ItalicElement {
  return {
    type: "italic",
    uuid: uuidv4(),
    start: min(start, end),
    end: max(start, end),
  };
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

export function mergeInlineElements(inlineElements: InlineElement[]) {}
