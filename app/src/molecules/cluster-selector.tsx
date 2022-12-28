import type { ChangeEvent } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Form } from "react-final-form";
import { useCallback, useMemo, useState } from "react";

import type * as TCluster from "../contexts/solana-connection-context.d";
import * as Styled from "./cluster-selector.styled";
import useBlockchain, {
  endpoints,
} from "../contexts/solana-connection-context";
import { clusterValidator } from "../utils/validators";
import Cluster, { populateCustomCluster } from "../domain/cluster";
import { useSnackbar } from "../contexts/notification-context";

const clstr = Cluster(endpoints.solana);

const clusterChangeAlert = (isError: Error | undefined, moniker: string) => {
  const msg = !isError
    ? `Cluster changed to "${moniker}"`
    : "Address should be a proper URL";
  const variant: any = !isError
    ? { variant: "success", autoHideDuration: 1e3 }
    : { variant: "error", autoHideDuration: 2e3 };

  return { msg, variant };
};

export default function ClusterSelector({ onClose }: { onClose?: () => void }) {
  const { enqueueSnackbar } = useSnackbar();

  const { cluster, clusters, setCluster } = useBlockchain();
  const [clusterMoniker, setClusterMoniker] = useState(cluster.moniker);

  const isCustomSelected = clusterMoniker === endpoints.custom.moniker;

  const selectedCluster = useMemo(
    () => clusters.find((c) => c.moniker === clusterMoniker),
    [clusterMoniker]
  );

  const { preset, custom } = useMemo(() => {
    const hasCustom = clusters.find((c) => clstr.isCustom(c));
    const presets = hasCustom
      ? clusters.filter((c) => !clstr.isCustom(c))
      : clusters;

    return {
      preset: presets,
      custom: hasCustom,
    };
  }, [clusters]);

  const onSaveCustomEndpoint = useCallback(
    async ({ endpoint }: { endpoint: string }) => {
      const customCluster: TCluster.CustomClusterInfo = {
        endpoint,
        name: "Custom",
        moniker: "custom",
      };
      const isError = setCluster(customCluster);

      const { msg, variant } = clusterChangeAlert(isError, customCluster.moniker);
      enqueueSnackbar(msg, variant);
      console.log("cluster", { isError });

      if (!isError && onClose) onClose();
    },
    [clusters, onClose, setCluster]
  );

  const onSavePresetEndpoint = useCallback(
    ({ endpoint }: { endpoint: string }) => {
      const isError = setCluster(endpoint);

      console.log("CLS1", isError, endpoint);

      const { msg, variant } = clusterChangeAlert(isError, endpoint);
      enqueueSnackbar(msg, variant);
      console.log("cluster", { isError });

      if (!isError && onClose) onClose();
    },
    [enqueueSnackbar, onClose, setCluster]
  );

  const onClusterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target as { value: TCluster.Moniker };

      console.log("cluster", value, "cust", isCustomSelected);

      setClusterMoniker(value);

      if (!clstr.isCustomMoniker(value)) {
        onSavePresetEndpoint({ endpoint: value });
      }
    },
    [isCustomSelected, onSavePresetEndpoint]
  );

  return (
    <Box>
      <FormControl>
        <RadioGroup
          name="clusters"
          value={clusterMoniker}
          onChange={onClusterChange}
        >
          {preset.map((c) => (
            <FormControlLabel
              key={c.name}
              label={c.name}
              control={<Radio />}
              value={c.moniker}
            />
          ))}
          <FormControlLabel label="Custom" control={<Radio />} value="custom" />
        </RadioGroup>
        {isCustomSelected && (
          <Form
            initialValues={{
              endpoint: endpoints.custom.endpoint,
            }}
            onSubmit={onSaveCustomEndpoint}
            validate={clusterValidator(
              yup.object().shape({
                endpoint: yup.string().required().url(),
              })
            )}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Styled.FormInner pt={2}>
                  <Styled.FormField
                    label="RPC endpoint"
                    name="endpoint"
                    size="small"
                    variant="outlined"
                  />
                  <Styled.FormButton type="submit" variant="contained">
                    Switch
                  </Styled.FormButton>
                </Styled.FormInner>
              </form>
            )}
          </Form>
        )}
      </FormControl>
    </Box>
  );
}
