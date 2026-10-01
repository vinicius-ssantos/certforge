import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Confirm } from "./Confirm";

function setup(onConfirm = vi.fn()) {
  render(
    <Confirm title="Confirm retiring" explain="This cannot be undone." confirmLabel="Yes, retire" onConfirm={onConfirm}>
      Retire
    </Confirm>,
  );
  return onConfirm;
}

describe("Confirm", () => {
  it("does nothing until the second step, and moves focus to the confirming button", async () => {
    const user = userEvent.setup();
    const onConfirm = setup();

    await user.click(screen.getByRole("button", { name: "Retire" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "Confirm retiring" })).toHaveTextContent("This cannot be undone.");
    expect(screen.getByRole("button", { name: "Yes, retire" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Yes, retire" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("returns focus to the button that asked when cancelled", async () => {
    const user = userEvent.setup();
    const onConfirm = setup();

    await user.click(screen.getByRole("button", { name: "Retire" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("button", { name: "Retire" })).toHaveFocus();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("can be cancelled from the keyboard", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Retire" }));
    await user.keyboard("{Tab}{Enter}");

    expect(screen.getByRole("button", { name: "Retire" })).toHaveFocus();
  });
});
