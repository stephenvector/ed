export type LinkElement = {
  type: "link";
  start: number;
  end: number;
  href: string;
  openInNewWindow: boolean;
  uuid: string;
};

export type ItalicElement = {
  type: "italic";
  start: number;
  end: number;
  uuid: string;
};

export type InlineElement = LinkElement | ItalicElement;

export type ParagraphState = {
  content: string;
  inlineElements: InlineElement[];
};
