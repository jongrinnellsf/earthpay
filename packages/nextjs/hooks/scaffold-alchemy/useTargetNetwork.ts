import { useEffect, useMemo } from "react";
import { useClient } from "./useClient";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-alchemy";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-alchemy";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { client } = useClient() || { client: undefined };
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const defaultNetwork = scaffoldConfig.targetNetworks[0];
    if (defaultNetwork && defaultNetwork.id !== targetNetwork.id) {
      setTargetNetwork(defaultNetwork);
    }
  }, [setTargetNetwork, targetNetwork.id]);

  return useMemo(
    () => ({
      targetNetwork: {
        ...targetNetwork,
        ...NETWORKS_EXTRA_DATA[targetNetwork.id],
      },
    }),
    [targetNetwork],
  );
}
