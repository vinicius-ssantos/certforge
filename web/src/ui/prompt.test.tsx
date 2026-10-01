import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Prompt, splitFences } from "./Prompt";

describe("splitFences", () => {
  it("separates prose from fenced code, in order", () => {
    expect(splitFences("Before.\n\n```java\nint x = 1;\n```\n\nAfter.")).toEqual([
      { kind: "text", value: "Before.\n\n" },
      { kind: "code", value: "int x = 1;" },
      { kind: "text", value: "\n\nAfter." },
    ]);
  });

  it("keeps text with no fences as one piece", () => {
    expect(splitFences("Just words.")).toEqual([{ kind: "text", value: "Just words." }]);
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
  it("shows code as code and never as markup", () => {
    render(<Prompt text={'Run <b>this</b>:\n\n```java\nSystem.out.println("<i>x</i>");\n```'} />);

    expect(screen.getByLabelText("Code example")).toHaveTextContent('System.out.println("<i>x</i>");');
    expect(screen.getByText("Run <b>this</b>:")).toBeInTheDocument();
    expect(document.querySelector("b, i")).toBeNull();
  });
});
