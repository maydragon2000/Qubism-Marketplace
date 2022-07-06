import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { connectorLocalStorageKey, getConnector } from "../utils/connectors"

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();
  const [activateError, setActivateError] = useState()
  const connector = window.localStorage.getItem(connectorLocalStorageKey);
  useEffect(() => {
    if (suppress) {
      return () => {};
    }
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error) {
      const handleChainChanged = (chainId) => {
        console.log("chainChanged", chainId);
        if (connector && connector != "") {
          const currentConnector = getConnector(connector)
          activate(currentConnector);
        }
      };

      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts.length > 0) {
          if (connector && connector != "") {
            const currentConnector = getConnector(connector)
            activate(currentConnector);
          }
        }
      };

      const handleNetworkChanged = (networkId) => {
        console.log("networkChanged", networkId);
        if (connector && connector != "") {
          const currentConnector = getConnector(connector)
          activate(currentConnector);
        }
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }

    if(error) {
      setActivateError(error)
    }
      
    return () => {};
  }, [active, error, suppress, activate]);

  return {activateError};
}
