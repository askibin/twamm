import type { SyntheticEvent } from "react";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import { Form } from "react-final-form";
import { TextField } from "mui-rff";
import { useCallback } from "react";

import useBlockchainConnectionContext from "../../hooks/use-blockchain-connection-context";
import { clusterValidator } from "../../utils/validators";

export interface Props {
  handleClose?: () => void;
}

export default function ClusterSelector({ handleClose = () => {} }: Props) {
  const { cluster, clusters, setCluster } = useBlockchainConnectionContext();

  const onClusterSelect = useCallback(
    (endpoint: string) => {
      if (globalThis.localStorage) {
        globalThis.localStorage.setItem("twammClusterEndpoint", endpoint);
      }
      handleClose();
    },
    [handleClose]
  );

  const handleListItemClick = useCallback(
    (event: SyntheticEvent<HTMLLIElement>) => {
      const { endpoint } = event.currentTarget.dataset;

      if (endpoint) {
        setCluster(clusters.find((item) => item.endpoint === endpoint)!);
        onClusterSelect(endpoint);
      }
    },
    [clusters, onClusterSelect, setCluster]
  );

  const handleFormSubmit = useCallback(
    async ({ endpoint }: { endpoint: string }) => {
      const origin = clusters.find((item) => item.moniker === cluster.moniker)!;

      setCluster({
        endpoint,
        moniker: origin?.moniker ?? "custom",
        name: origin?.name ?? "Custom",
      });

      onClusterSelect(endpoint);
    },
    [cluster, clusters, onClusterSelect, setCluster]
  );

  return (
    <Box>
      <FormControl>
        <List>
          {clusters.map(({ endpoint, name }) => (
            <>
              <ListItem
                data-endpoint={endpoint}
                key={endpoint}
                onClick={handleListItemClick}
                selected={cluster.endpoint === endpoint}
              >
              <Radio />
                {name}
              </ListItem>
            </>
          ))}
          <Form
            initialValues={{
              endpoint:
                cluster.moniker === "custom" ? undefined : cluster.endpoint,
            }}
            onSubmit={handleFormSubmit}
            validate={clusterValidator(
              yup.object().shape({
                endpoint: yup.string().required().url(),
              })
            )}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    color: "text.neutral",
                    alignItems: "flex-start",
                    display: "flex",
                    padding: "8px 16px",
                  }}
                >
                  <TextField
                    label="RPC endpoint"
                    name="endpoint"
                    InputProps={{ sx: { color: "#fff" } }}
                    size="small"
                    variant="outlined"
                  />
                  <Button
                    sx={{ marginLeft: "12px" }}
                    type="submit"
                    variant="contained"
                  >
                    Switch
                  </Button>
                </Box>
              </form>
            )}
          </Form>
        </List>
      </FormControl>
    </Box>
  );
}
