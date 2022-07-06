import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { currentNetwork } from "./index"
import getNodeUrl from "./getRpcUrl"
import Metamask from "../icons/Metamask";
import TrustWallet from "../icons/TrustWallet";
import WalletConnect from "../icons/WalletConnect";

const POLLING_INTERVAL = 12000


export const injectedConnector = new InjectedConnector({ supportedChainIds: [+currentNetwork] });

export function getConnector(connectorId) {
  switch (connectorId) {
    case "injectedConnector":
      return injectedConnector; 
    case "walletconnect":
      return walletconnect;     
    default:
      return injectedConnector;
  }
}

export const walletconnect = new WalletConnectConnector({
  rpc: {
    [+currentNetwork]: getNodeUrl()
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})


export const connectorsByName = {
  'Injected': injectedConnector,
  'WalletConnect': walletconnect  
}

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: injectedConnector,
    key: "injectedConnector",
  },
  {
    title: "TrustWallet",
    icon: TrustWallet,
    connectorId: injectedConnector,
    key: "injectedConnector",
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: walletconnect,
    key: "walletconnect",
  }
]

export const connectorLocalStorageKey = "connectorId";