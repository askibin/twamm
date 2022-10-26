import type { ReactNode } from "react";
import { forwardRef, memo, useImperativeHandle, useState } from "react";

import UniversalModal from "./universal-modal";
import UniversalDrawer from "./universal-drawer";
import { useBreakpoints } from "../../hooks/use-breakpoints";

export interface Props {
  children: ReactNode;
}

interface ModalProps extends Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const Modal = memo(({ children, open, setOpen }: ModalProps) => (
  <UniversalModal open={open} setOpen={setOpen}>
    {children}
  </UniversalModal>
));

const Drawer = memo(({ children, open, setOpen }: ModalProps) => (
  <UniversalDrawer open={open} setOpen={setOpen}>
    {children}
  </UniversalDrawer>
));

export default forwardRef(({ children, _o = true }: Props, ref) => {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(_o); // ,false);

  useImperativeHandle(ref, () => ({
    close() {
      setOpen(false);
    },
    isOpened: open,
    open() {
      setOpen(true);
    },
  }));

  if (isMobile) {
    return (
      <Drawer open={open} setOpen={setOpen}>
        {children}
      </Drawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen}>
      {children}
    </Modal>
  );
});
