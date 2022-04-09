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
    href: "",
    openInNewWindow: false,
    start: min(start, end),
    end: max(start, end),
  };
}

export function getNewItalicElement(start: number, end: number): ItalicElement {
  return {
    type: "italic",
    start: min(start, end),
    end: max(start, end),
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
  newInlineElement: InlineElement[]
): InlineElement[] {
  inlineElements.forEach(inlineElement => {
    if (inlineElement.type !== inlineElement)
  })
  return inlineElements;
}
