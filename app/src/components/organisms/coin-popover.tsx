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
  tokens?: string[];
}

interface ModalProps extends Props {
  onSelect: (arg0: string) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
}

const Modal = memo(({ onSelect, open, setOpen, tokens }: ModalProps) => (
  <CoinModal
    open={open}
    setOpen={setOpen}
    onSelect={onSelect}
    tokens={tokens}
  />
));

const Drawer = memo(({ onSelect, open, setOpen, tokens }: ModalProps) => (
  <CoinDrawer
    onSelect={onSelect}
    open={open}
    setOpen={setOpen}
    tokens={tokens}
  />
));

export default forwardRef(({ onChange = () => {}, tokens }: Props, ref) => {
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
    return (
      <Drawer
        onSelect={onSelect}
        open={open}
        setOpen={setOpen}
        tokens={tokens}
      />
    );
  }

  return (
    <Modal onSelect={onSelect} open={open} setOpen={setOpen} tokens={tokens} />
  );
});
