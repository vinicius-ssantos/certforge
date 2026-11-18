import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Prompt, splitFences } from "./Prompt";

describe("splitFences", () => {
  it("separates prose from fenced code, in order", () => {
    expect(splitFences("Before.\n\n```java\nint x = 1;\n```\n\nAfter.")).toEqual([
      { kind: "text", value: "Before.\n\n", language: "" },
      { kind: "code", value: "int x = 1;", language: "java" },
      { kind: "text", value: "\n\nAfter.", language: "" },
    ]);
  });

  it("keeps text with no fences as one piece", () => {
    expect(splitFences("Just words.")).toEqual([
      { kind: "text", value: "Just words.", language: "" },
    ]);
  });

  it("captures the fence's language tag, and treats an untagged fence as empty", () => {
    const [java, untagged] = splitFences("```yaml\na: 1\n```\n```\nplain\n```");
    expect(java).toMatchObject({ language: "yaml" });
    expect(untagged).toMatchObject({ language: "" });
  });

  it("treats an unclosed fence as plain text rather than swallowing the rest", () => {
    const segments = splitFences("Look:\n```java\nint x;");
    expect(segments.every((segment) => segment.kind === "text")).toBe(true);
  });

  it("handles several blocks and an empty string", () => {
    expect(splitFences("```\na\n```\n```\nb\n```").map((segment) => segment.value)).toEqual(["a", "b"]);
    expect(splitFences("")).toEqual([]);
  });
});

describe("Prompt", () => {
  it("renders CRLF and mixed line endings like LF, preserving code and paragraph structure", () => {
    const lf = "First.\n\nSecond.\n\n```java\nclass Example {\n\n  int value = 1;\n}\n```\n\n```\n  plain\n\n  text\n```";
    const { container, rerender } = render(<Prompt text={lf} />);
    const expected = container.innerHTML;

    for (const text of [lf.replace(/\n/g, "\r\n"), lf.replace(/\n/g, (_, offset: number) => offset % 2 ? "\r\n" : "\n")]) {
      rerender(<Prompt text={text} />);
      expect(container.innerHTML).toBe(expected);
      expect(container.querySelectorAll("p")).toHaveLength(2);
      const blocks = screen.getAllByLabelText("Code example");
      expect(blocks[0]).toHaveAttribute("tabindex", "0");
      expect(blocks[0]?.querySelectorAll(".token").length).toBeGreaterThan(0);
      expect(blocks[0]?.textContent).toContain("\n\n  int value = 1;");
      expect(blocks[1]?.textContent).toBe("  plain\n\n  text");
    }
  });

  it("makes a paragraph of each block of text and keeps single line breaks inside one", () => {
    const { container } = render(<Prompt text={"First paragraph.\nStill the first.\n\nSecond paragraph."} />);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent("First paragraph. Still the first.");
    expect(paragraphs[0]?.textContent).toContain("\n");
    expect(paragraphs[1]).toHaveTextContent("Second paragraph.");
  });

  it("shows code as code and never as markup", () => {
    render(<Prompt text={'Run <b>this</b>:\n\n```java\nSystem.out.println("<i>x</i>");\n```'} />);

    expect(screen.getByLabelText("Code example")).toHaveTextContent('System.out.println("<i>x</i>");');
    expect(screen.getByText("Run <b>this</b>:")).toBeInTheDocument();
    expect(document.querySelector("b, i")).toBeNull();
  });

  it("highlights a known language via CSS classes, never an inline style", () => {
    render(<Prompt text={'```java\nSystem.out.println("hi");\n```'} />);

    const pre = screen.getByLabelText("Code example");
    const tokens = pre.querySelectorAll(".token");
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      expect(token.getAttribute("style")).toBeNull();
    }
    expect(pre).toHaveTextContent('System.out.println("hi");');
  });

  it("maps the dockerfile content tag onto Prism's docker grammar", () => {
    render(<Prompt text={"```dockerfile\nFROM ubuntu\n```"} />);

    const pre = screen.getByLabelText("Code example");
    expect(pre.querySelectorAll(".token").length).toBeGreaterThan(0);
    expect(pre).toHaveTextContent("FROM ubuntu");
  });

  it("falls back to plain, unhighlighted text for a language with no registered grammar", () => {
    render(<Prompt text={"```text\nplain output\n```"} />);

    const pre = screen.getByLabelText("Code example");
    expect(pre.querySelectorAll(".token")).toHaveLength(0);
    expect(pre).toHaveTextContent("plain output");
  });
});

