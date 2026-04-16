import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (shortcuts.enabled === false) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          shortcuts.onEscape?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          shortcuts.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          shortcuts.onArrowDown?.();
          break;
        case 'Enter':
          shortcuts.onEnter?.();
          break;
        case 'Tab':
          event.preventDefault();
          shortcuts.onTab?.();
          break;
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useFocusNavigation(containerRef: React.RefObject<HTMLElement>) {
  const handleTab = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (document.activeElement === lastElement) {
      firstElement.focus();
    }
  }, [containerRef]);

  return { handleTab };
}
