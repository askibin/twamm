import { useCallback } from "react";
import Button from "../molecules/progress-button";
import useScheduleOrder from "../../hooks/use-schedule-order";

export interface Props {
  disabled: boolean;
  form?: string;
  scheduled: boolean;
  params: any;
  populateParams: () => Promise<any>;
  progress: boolean;
  validate: () => { [key: string]: Error };
}

export default (props: Props) => {
  const { execute } = useScheduleOrder();

  const onClick = useCallback(async () => {
    console.log("ordersubmit", props.validate());

    const params = await props.populateParams();

    console.log({ params });

    execute();
  }, [execute, props.populateParams, props.validate]);

  return (
    <Button
      disabled={props.disabled}
      form={props.form}
      loading={props.progress}
      onClick={onClick}
      text={props.scheduled ? "Schedule Order" : "Place Order"}
    />
  );
};
