// Set of helper functions to facilitate wallet setup

import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add MATIC as a network on Metamask, or switch to MATIC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
 export const setupNetwork = async () => {
  
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_NETWORK_ID, 10)
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `${process.env.REACT_APP_NETWORK}`,
            nativeCurrency: {
              name: `${process.env.REACT_APP_CURRENCY}`,
              symbol: `${process.env.REACT_APP_CURRENCY}`,
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${process.env.REACT_APP_BLOCK_EXPLORER}`],
          },
        ],
      })
      return true
    } catch (error) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,            
          },
        ],
      })
      return true
    }
  } else {
    console.error("Can't setup the Binance Chain on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}
