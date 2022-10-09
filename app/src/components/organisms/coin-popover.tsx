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
  onDeselect: (arg0: string) => void;
  onSelect: (arg0: JupToken) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
  tokensToDeselect?: string;
}

const Modal = memo(
  ({
    onDeselect,
    onSelect,
    open,
    setOpen,
    tokens,
    tokensToDeselect,
  }: ModalProps) => (
    <CoinModal
      onDeselect={onDeselect}
      onSelect={onSelect}
      open={open}
      setOpen={setOpen}
      tokens={tokens}
      tokensToDeselect={tokensToDeselect}
    />
  )
);

const Drawer = memo(
  ({
    onDeselect,
    onSelect,
    open,
    setOpen,
    tokens,
    tokensToDeselect,
  }: ModalProps) => (
    <CoinDrawer
      onDeselect={onDeselect}
      onSelect={onSelect}
      open={open}
      setOpen={setOpen}
      tokens={tokens}
      tokensToDeselect={tokensToDeselect}
    />
  )
);

export default forwardRef(
  (
    { onDeselect: handleDeselect, onChange, tokens, tokensToDeselect }: Props,
    ref
  ) => {
    const { isMobile } = useBreakpoints();
    const [open, setOpen] = useState(false);

    const onDeselect = useCallback(
      (symbol: string) => {
        handleDeselect(symbol);
      },
      [handleDeselect]
    );

    const onSelect = useCallback(
      (token: JupToken) => {
        onChange(token);
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
          onDeselect={onDeselect}
          onSelect={onSelect}
          open={open}
          setOpen={setOpen}
          tokens={tokens}
          tokensToDeselect={tokensToDeselect}
        />
      );
    }

    return (
      <Modal
        onDeselect={onDeselect}
        onSelect={onSelect}
        open={open}
        setOpen={setOpen}
        tokens={tokens}
        tokensToDeselect={tokensToDeselect}
      />
    );
  }
);
