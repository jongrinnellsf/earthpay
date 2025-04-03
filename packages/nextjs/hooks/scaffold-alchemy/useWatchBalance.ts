import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import { UseBalanceParameters, useBalance, useBlockNumber } from "wagmi";

/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
export const useWatchBalance = (useBalanceParameters: UseBalanceParameters) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  
  // Add defensive programming to handle potential null cases
  const { data: blockNumber } = useBlockNumber({ 
    watch: true, 
    chainId: targetNetwork?.id,
    query: {
      // Only enable watching if we have a valid network
      enabled: !!targetNetwork?.id
    }
  });
  
  // Handle the case where useBalanceParameters.address might be undefined
  const { queryKey, ...restUseBalanceReturn } = useBalance({
    ...useBalanceParameters,
    query: {
      ...useBalanceParameters.query,
      // Disable query if address is undefined to prevent errors
      enabled: !!useBalanceParameters.address && !!(useBalanceParameters.query?.enabled ?? true)
    }
  });

  useEffect(() => {
    // Only invalidate if we have a valid queryKey and blockNumber
    if (queryKey && blockNumber) {
      queryClient.invalidateQueries({ queryKey });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return restUseBalanceReturn;
};
