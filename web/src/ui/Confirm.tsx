import { useEffect, useRef, useState, type ReactNode } from "react";
import { useText } from "../i18n/useText";

/**
 * A two-step action for something that cannot be taken back. The first button asks; the group that
 * replaces it explains what will happen and offers the real button and a way out.
 *
 * Focus follows: asking moves it to the confirming button (the control that was focused has just
 * disappeared), and cancelling returns it to the button that asked, so a keyboard or screen-reader
 * user is never left on nothing.
 */
export function Confirm({
  children,
  triggerClassName,
  title,
  explain,
  confirmLabel,
  cancelLabel,
  busy = false,
  onConfirm,
}: {
  children: ReactNode;
  triggerClassName?: string;
  title: string;
  explain: string;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
}) {
  const t = useText();
  const [asking, setAsking] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const confirm = useRef<HTMLButtonElement>(null);
  const hasAsked = useRef(false);

  useEffect(() => {
    if (asking) {
      hasAsked.current = true;
      confirm.current?.focus();
    } else if (hasAsked.current) {
      trigger.current?.focus();
    }
  }, [asking]);

  if (!asking) {
    return (
      <button ref={trigger} type="button" className={triggerClassName} onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  }
  return (
    <div role="group" aria-label={title} className="confirm">
      <p>{explain}</p>
      <button ref={confirm} type="button" onClick={onConfirm} disabled={busy}>
        {confirmLabel}
      </button>{" "}
      <button type="button" className="secondary" onClick={() => setAsking(false)}>
        {cancelLabel ?? t.confirm.cancel}
      </button>
    </div>
  );
}
