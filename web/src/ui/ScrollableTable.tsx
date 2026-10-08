import type { ComponentPropsWithoutRef } from "react";

interface ScrollableTableProps extends ComponentPropsWithoutRef<"table"> {
  label: string;
}

/**
 * Keeps wide data tables inside the page on narrow viewports.
 *
 * WCAG requires a horizontally scrollable region to be keyboard-focusable, so the wrapper is a
 * named region and a Tab stop. The jsx-a11y rule is intentionally suppressed here because it
 * treats every non-interactive tab stop as invalid and does not model this scroll-container case.
 */
export function ScrollableTable({ label, children, ...tableProps }: ScrollableTableProps) {
  return (
    <>
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
      <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
        <table {...tableProps}>{children}</table>
      </div>
      {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
    </>
  );
}
