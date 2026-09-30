"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  id?: string;
  title?: string;
};

export function Popup({
  open,
  onClose,
  children,
  id,
  title = "Подробности",
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const root = dialogRef.current;
    const focusables = () =>
      root
        ? Array.from(
            root.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute("disabled"))
        : [];

    requestAnimationFrame(() => {
      const items = focusables();
      (items[0] || root)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root) return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="popup popup_open"
      id={id}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="popup__new"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <span id={titleId} className="visually-hidden">
          {title}
        </span>
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <img
            src="/blocks/popup/file/Close.svg"
            alt=""
            className="popup__close"
          />
        </button>
        {children}
      </div>
    </div>
  );
}

export function usePopup() {
  const [open, setOpen] = useState(false);
  return {
    open,
    openPopup: () => setOpen(true),
    closePopup: () => setOpen(false),
  };
}
