import { forwardRef, memo, useImperativeHandle, useState } from "react";

import CoinModal from "../molecules/coin-modal";
import CoinDrawer from "../molecules/coin-drawer";
import { useBreakpoints } from "../../hooks/use-breakpoints";

export interface Props {}

const Modal = memo((props: Props) => <CoinModal {...props} />);

const Drawer = memo((props: Props) => <CoinDrawer {...props} />);

export default forwardRef((props: Props, ref) => {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(true);
  // should be false

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
    return <Drawer open={open} setOpen={setOpen} {...props} />;
  }

  return <Modal open={open} setOpen={setOpen} {...props} />;
});
