import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollableTable } from "./ScrollableTable";

function renderTable() {
  return render(
    <ScrollableTable label="Coverage">
      <tbody><tr><td>A topic</td></tr></tbody>
    </ScrollableTable>,
  );
}

describe("scrollable table", () => {
  it("does not add a Tab stop when all columns fit", () => {
    renderTable();
    expect(screen.getByRole("region", { name: "Coverage" })).not.toHaveAttribute("tabindex");
  });

  it("adds a keyboard-reachable region when the table overflows", () => {
    const scrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    try {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 500 });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 300 });
      renderTable();
      expect(screen.getByRole("region", { name: "Coverage" })).toHaveAttribute("tabindex", "0");
    } finally {
      if (scrollWidth) Object.defineProperty(HTMLElement.prototype, "scrollWidth", scrollWidth);
      else Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidth);
      else Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
    }
  });
});
