import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useCallback, useMemo } from "react";
import Button from "../molecules/progress-button";
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
  const { execute } = useScheduleOrder();

  const onClick = useCallback(async () => {
    console.log({ params: props.params });

    if (!props.params) return;

    // FIXME: remove this 4 prod
    console.debug("exec", props.params); // eslint-disable-line no-console
    await execute(props.params);

    props.onSuccess();
  }, [execute, props]);

  const errors = useMemo(() => props.validate(), [props]);

  return (
    <>
      <Button
        disabled={props.disabled}
        form={props.form}
        loading={props.progress}
        onClick={onClick}
        text={props.scheduled ? "Schedule Order" : "Place Order"}
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
