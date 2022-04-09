import { paragraphStateToHtml } from ".";

describe("paragraphStateToHtml()", () => {
  it("should return a string when no inline elements exist", () => {
    expect(
      paragraphStateToHtml({
        content: "this is a test",
        inlineElements: [],
      })
    ).toBe("this is a test");
  });
});
