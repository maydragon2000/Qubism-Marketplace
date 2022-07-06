import { useState, useEffect } from "react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { connectorLocalStorageKey, getConnector } from "../utils/connectors"
import { setupNetwork } from '../utils/wallet'

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)
  const [error, setError] = useState()
  const connector = window.localStorage.getItem(connectorLocalStorageKey);  
  useEffect(() => {
    if (connector && connector != "") {
      const currentConnector = getConnector(connector)
      if (connector === "injectedConnector") {
        currentConnector.isAuthorized().then((isAuthorized) => {
          console.log("useEagerConnect:", { active, isAuthorized })
          if (isAuthorized) {            
            activate(currentConnector, undefined, true).catch((error) => {              
              if (error instanceof UnsupportedChainIdError) {
                setupNetwork().then((hasSetup) => {
                  console.log("hasSetup")
                  console.log(hasSetup)
                  if (hasSetup)
                    activate(currentConnector);
                })
              }
              setError(error)
              setTried(true)
            })
          } else {          
            setTried(true)
          }
        })
      } else {
        activate(currentConnector);
        setTried(true)
      }
    }    
  }, [activate, connector]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return [tried, error]
}
