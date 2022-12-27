import type { ChangeEvent } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Form } from "react-final-form";
import { useCallback, useState } from "react";

import type * as TCluster from "../contexts/solana-connection-context.d";
import * as Styled from "./cluster-selector.styled";
import useBlockchain, {
  endpoints,
} from "../contexts/solana-connection-context";
import { clusterValidator } from "../utils/validators";

export interface Props {
  handleClose?: () => void;
}

export default function ClusterSelector({ handleClose }: Props) {
  const { cluster, clusters, setCluster } = useBlockchain();
  const [clusterName, setClusterName] = useState<string>(cluster.name);

  const onSaveCustomEndpoint = useCallback(
    async ({ endpoint }: { endpoint: string }) => {
      const predefinedEndpoints = clusters
        .filter((c) => c.moniker !== endpoints.custom.moniker)
        .map((c) => c.endpoint);

      const inputPredefinedEndpointIndex = predefinedEndpoints.findIndex(
        (e) => e === endpoint
      );

      if (inputPredefinedEndpointIndex !== -1) {
        setCluster(clusters[inputPredefinedEndpointIndex]);
      } else {
        const customCluster: TCluster.CustomClusterInfo = {
          endpoint,
          name: "Custom",
          moniker: "custom",
        };
        setCluster(customCluster);
      }

      if (handleClose) handleClose();
    },
    [clusters, handleClose, setCluster]
  );

  const onClusterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setClusterName(value);

      if (value !== endpoints.custom.name) {
        setCluster(
          clusters.find((c) => c.name === value) as TCluster.ClusterInfo
        );
      }
    },
    [clusters, setCluster]
  );

  return (
    <Box>
      <FormControl>
        <RadioGroup
          name="clusters"
          value={clusterName}
          onChange={onClusterChange}
        >
          {clusters.map(({ name }) => (
            <FormControlLabel
              key={name}
              label={name === "mainnet-beta" ? "Solana" : name}
              control={<Radio />}
              value={name}
            />
          ))}
        </RadioGroup>
        {clusterName === endpoints.custom.name && (
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
