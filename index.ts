export enum BlockType {
  Text = "#text",
  Paragraph = "p",
  PreCode = "precode",
}

export type TextBlock = {
  type: BlockType.Text;
  content: string;
  uuid: string;
};

export type ParagraphBlock = {
  uuid: string;
  type: BlockType.Paragraph;
  content: TextBlock[];
};

export type PreCodeBlock = {
  content: string;
  type: BlockType.PreCode;
  uuid: string;
  language: string;
};

export type Block = TextBlock | ParagraphBlock | PreCodeBlock;

export type ParentBlock = ParagraphBlock | PreCodeBlock;
