import type { ReactNode } from "react";
import { forwardRef, memo, useImperativeHandle, useState } from "react";

import UniversalDrawer from "./universal-drawer";
import UniversalModal from "./universal-modal";
import useBreakpoints from "../../hooks/use-breakpoints";

export interface Props {
  children: ReactNode;
  onClose?: () => void;
}

interface ModalProps extends Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const Modal = memo(({ children, onClose, open, setOpen }: ModalProps) => (
  <UniversalModal onClose={onClose} open={open} setOpen={setOpen}>
    {children}
  </UniversalModal>
));

const Drawer = memo(({ children, onClose, open, setOpen }: ModalProps) => (
  <UniversalDrawer onClose={onClose} open={open} setOpen={setOpen}>
    {children}
  </UniversalDrawer>
));

export default forwardRef(({ children, onClose }: Props, ref) => {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(false);

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
      <Drawer onClose={onClose} open={open} setOpen={setOpen}>
        {children}
      </Drawer>
    );
  }

  return (
    <Modal onClose={onClose} open={open} setOpen={setOpen}>
      {children}
    </Modal>
  );
});
