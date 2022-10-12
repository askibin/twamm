import { useCallback, useState } from "react";
import type { MouseEvent } from "react";

export function useMenu() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const isOpened = Boolean(anchor);

  const handleMenuClose = useCallback(() => setAnchor(null), [setAnchor]);

  const handleMenuOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget),
    [setAnchor]
  );

  return {
    anchor,
    closeMenu: handleMenuClose,
    isOpened,
    openMenu: handleMenuOpen,
  };
}
