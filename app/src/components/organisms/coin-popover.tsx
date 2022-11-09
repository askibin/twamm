import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

import CoinModal from "../molecules/coin-modal";
import CoinDrawer from "../molecules/coin-drawer";
import useBreakpoints from "../../hooks/use-breakpoints";

export interface Props {
  onChange: (arg0: TokenInfo) => void;
  onDeselect: (arg0: string) => void;
  tokens?: string[];
  tokensToDeselect?: string[];
}

interface ModalProps extends Omit<Props, "onChange"> {
  onSelect: (arg0: TokenInfo) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
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
      (token: TokenInfo) => {
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
