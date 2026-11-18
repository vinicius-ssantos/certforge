import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useText } from "../i18n/useText";

interface ScrollableTableProps extends ComponentPropsWithoutRef<"table"> {
  label: string;
}

export function ScrollableTable({ label, children, ...tableProps }: ScrollableTableProps) {
  const t = useText();
  const region = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const update = () => {
      const node = region.current;
      if (node) setOverflowing(node.scrollWidth > node.clientWidth + 1);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    if (region.current) observer.observe(region.current);
    if (table.current) observer.observe(table.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {overflowing ? <p className="hint table-scroll-hint">{t.states.tableMore}</p> : null}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div ref={region} className="table-scroll" role="region" aria-label={label} tabIndex={overflowing ? 0 : undefined}>
        <table ref={table} {...tableProps}>{children}</table>
      </div>
    </>
  );
}
