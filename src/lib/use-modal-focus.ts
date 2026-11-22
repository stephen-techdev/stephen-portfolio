import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type FocusTarget = React.RefObject<HTMLElement | null>;

/**
 * Traps keyboard focus inside an open dialog, closes on Escape, and restores
 * focus to the element that opened it. `onClose` is read from a ref so passing
 * an inline callback does not restart the effect on every render.
 */
export function useModalFocus<T extends HTMLElement = HTMLDivElement>(
  open: boolean,
  onClose: () => void,
  initialFocus?: FocusTarget,
) {
  const containerRef = useRef<T | null>(null);
  const closeRef = useRef(onClose);
  const initialFocusRef = useRef(initialFocus);

  useEffect(() => {
    closeRef.current = onClose;
    initialFocusRef.current = initialFocus;
  }, [onClose, initialFocus]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    const selectFocusable = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.getClientRects().length > 0,
      );

    const initial = initialFocusRef.current?.current ?? selectFocusable()[0] ?? container;
    initial?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = selectFocusable();
      if (items.length === 0) {
        event.preventDefault();
        container?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return containerRef;
}
