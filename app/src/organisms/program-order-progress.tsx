import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo, useRef } from "react";
import Button from "../molecules/progress-button";
import i18n from "../i18n";
import SimpleCancelOrder from "../molecules/cancel-order-simple-modal";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import useScheduleOrder from "../hooks/use-schedule-order";
import { prepare4Program } from "../domain/order";

export default (props: {
  disabled: boolean;
  form?: string;
  onSuccess: () => void;
  params: ReturnType<typeof prepare4Program> | undefined;
  progress: boolean;
  scheduled: boolean;
  validate: () => { [key: string]: Error } | undefined;
}) => {
  const cancelRef = useRef<Ref>();
  const { execute } = useScheduleOrder();

  console.log("AA", props.params);

  const cancelDetails = useMemo(
    () =>
      props.params
        ? {
            a: new PublicKey(props.params.aMint),
            b: new PublicKey(props.params.bMint),
          }
        : undefined,
    [props.params]
  );

  const onApproveCancel = useCallback(() => {}, []);

  const onExecuteError = useCallback(async () => {
    console.log(567, props.params);

    cancelRef.current?.open();
  }, [cancelRef, props.params]);

  const onClick = useCallback(async () => {
    if (!props.params) return;

    await execute(props.params, onExecuteError);

    props.onSuccess();
  }, [execute, onExecuteError, props]);

  const errors = useMemo(() => props.validate(), [props]);

  return (
    <>
      <UniversalPopover ref={cancelRef}>
        {cancelDetails && (
          <SimpleCancelOrder data={cancelDetails} onApprove={onApproveCancel} />
        )}
      </UniversalPopover>
      <Button
        disabled={props.disabled}
        form={props.form}
        loading={props.progress}
        onClick={onClick}
        text={
          props.scheduled
            ? i18n.OrderControlsScheduleOrder
            : i18n.OrderControlsPlaceOrder
        }
      />
      {!errors ? null : (
        <Box pt={1}>
          <Alert severity="error">
            <>
              {[...Object.keys(errors)].map((key) => (
                <div key={key}>{errors[key].message}</div>
              ))}
            </>
          </Alert>
        </Box>
      )}
    </>
  );
};
