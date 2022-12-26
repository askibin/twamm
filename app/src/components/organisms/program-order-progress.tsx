import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useCallback, useMemo } from "react";
import Button from "../molecules/progress-button";
import useScheduleOrder from "../../hooks/use-schedule-order";
import { prepare4Program } from "../molecules/token-pair-form.utils";

export interface Props {
  disabled: boolean;
  form?: string;
  params: ReturnType<typeof prepare4Program> | undefined;
  progress: boolean;
  scheduled: boolean;
  validate: () => { [key: string]: Error };
}

export default (props: Props) => {
  const { execute } = useScheduleOrder();

  const onClick = useCallback(async () => {
    if (!props.params) return;
    await execute(props.params);
  }, [execute, props.params]);

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
