import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

import CoinModal from "../molecules/coin-modal";
import CoinDrawer from "../molecules/coin-drawer";
import { useBreakpoints } from "../../hooks/use-breakpoints";

export interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  onChange?: (arg0: string) => void;
}

interface ModalProps extends Props {
  onSelect: (arg0: string) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

const Modal = memo(({ onSelect, open, setOpen }: ModalProps) => (
  <CoinModal open={open} setOpen={setOpen} onSelect={onSelect} />
));

const Drawer = memo(({ onSelect, open, setOpen }: ModalProps) => (
  <CoinDrawer onSelect={onSelect} open={open} setOpen={setOpen} />
));

export default forwardRef(({ onChange = () => {} }: Props, ref) => {
  const { isMobile } = useBreakpoints();
  const [open, setOpen] = useState(false);

  const onSelect = useCallback(
    (symbol: string) => {
      onChange(symbol);
    },
    [onChange]
  );

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
    return <Drawer onSelect={onSelect} open={open} setOpen={setOpen} />;
  }

  return <Modal onSelect={onSelect} open={open} setOpen={setOpen} />;
});
