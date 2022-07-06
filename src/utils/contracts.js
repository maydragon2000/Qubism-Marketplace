import { BigNumber, ethers } from "ethers";
import { getCollectionContract, getContractInfo, getContractObj } from ".";

export function isAddress(address) {
    try {
        ethers.utils.getAddress(address);
    } catch (e) { return false; }
    return true;
}

export function toEth(amount) {
  return ethers.utils.formatEther(String(amount), {commify: true});
}

export function toWei(amount) {
  return ethers.utils.parseEther(String(amount));
}

/**
 * Governance Token Contract Management
 */
export async function getTokenBalance(account, chainId, provider) {
    const Token = getContractObj('Token', chainId, provider);
    if(Token) {
        const balance = await Token.balanceOf(account);
        return toEth(balance);
    }
    return 0;
}

export async function isTokenApprovedForMarket(account, amount, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    const tokenContract = getContractObj('Token', chainId, provider);

    const allowance = await tokenContract.allowance(account, marketContract.address);
    if(BigNumber.from(toWei(amount)).gt(allowance)) {
        return false;
    }
    return true;
}
export async function isTokenApprovedForAuction(account, amount, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider);
    const tokenContract = getContractObj('Token', chainId, provider);

    const allowance = await tokenContract.allowance(account, auctionContract.address);
    if(BigNumber.from(toWei(amount)).gt(allowance)) {
        return false;
    }
    return true;
}

export async function approveTokenForMarket(chainId, signer) {
    const marketContract = getContractObj('QubismMarket', chainId, signer);
    const tokenContract = getContractObj('Token', chainId, signer);

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(marketContract.address, approveAmount);
        await approve_tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
        return false;
    }
}
export async function approveTokenForAuction(chainId, signer) {
    const auctionContract = getContractObj('QubismAuction', chainId, signer);
    const tokenContract = getContractObj('Token', chainId, signer);

    const approveAmount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
    try {
        const approve_tx = await tokenContract.approve(auctionContract.address, approveAmount);
        await approve_tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
        return false;
    }
}




/**
 * NFT Contract Management
 */
export async function isNFTApprovedForMarket(collection, account, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    const nftToken = getCollectionContract(collection, chainId, provider);

    return await nftToken.isApprovedForAll(account, marketContract.address);
}
export async function isNFTApprovedForAuction(collection, account, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider);
    const nftToken = getCollectionContract(collection, chainId, provider);

    return await nftToken.isApprovedForAll(account, auctionContract.address);
}

export async function setNFTApprovalForMarket(collection, approved, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    const nftToken = getCollectionContract(collection, chainId, provider);
    try {
        const tx = await nftToken.setApprovalForAll(marketContract.address, approved);
        await tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
    }
    return false;
}
export async function setNFTApprovalForAuction(collection, approved, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider);
    const nftToken = getCollectionContract(collection, chainId, provider);
    try {
        const tx = await nftToken.setApprovalForAll(auctionContract.address, approved);
        await tx.wait(1);
        return true;
    }catch(e) {
        console.log(e)
    }
    return false;
}

export async function addItem(collection, uri, royalty, chainId, provider) {
    const collectionContract = getCollectionContract(collection, chainId, provider);
    const QubismNFTContractInfo = getContractInfo('QubismNFT', chainId);
    try {
        const tx = await collectionContract.addItem(uri,royalty)
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(QubismNFTContractInfo.abi);
            const logs = receipt.logs;
            let tokenId = 0;
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(collection.toLowerCase() === log.address.toLowerCase()) {
                tokenId = interf.parseLog(log).args.tokenId.toNumber();
                return tokenId;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e)
        return false;
    }        
}




/**
 * Market Contract Management
 */

export async function createNewCollection(name, uri, bPublic, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    const marketContractInfo = getContractInfo('QubismMarket', chainId);
    console.log(marketContract)
    console.log(marketContractInfo)
    try {
        const tx =  await marketContract.createCollection(name, uri, bPublic);
        const receipt = await tx.wait(2);
        if(receipt.confirmations) {
            const interf = new ethers.utils.Interface(marketContractInfo.abi);
            const logs = receipt.logs;
            let collectionAddress = "";
            for(let index = 0; index < logs.length; index ++) {
              const log = logs[index];
              if(marketContractInfo.address.toLowerCase() === log.address.toLowerCase()) {
                collectionAddress = interf.parseLog(log).args.collection_address.toLowerCase();
                return collectionAddress;
              }
            }
        }
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

export async function listItem(collection, owner, token_id, price, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    const marketContractInfo = getContractInfo('QubismMarket', chainId);
    if (!marketContract || !marketContractInfo) return false
    try {
        let isApproved = await isNFTApprovedForMarket(collection, owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApprovalForMarket(collection, true, chainId, provider);            
        }
        if (isApproved) {
            const tx =  await marketContract.list(collection, token_id, ethers.utils.parseEther(price));
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                const interf = new ethers.utils.Interface(marketContractInfo.abi);
                const logs = receipt.logs;
                let pairId  = 0;
                for(let index = 0; index < logs.length; index ++) {
                    const log = logs[index];
                    if(marketContractInfo.address.toLowerCase() === log.address.toLowerCase()) {
                        pairId = interf.parseLog(log).args.id.toString();
                        return pairId;
                    }
                }
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

export async function delistItem(id, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider);
    if (!marketContract) return false
    try {
      const tx = await marketContract.delist(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
  
export async function buy(account, id, price, chainId, provider) {
    const marketContract = getContractObj('QubismMarket', chainId, provider)
    const Token = getContractObj('Token', chainId, provider)
    if (!marketContract || !Token) return false    
    try {
        let isTokenApproved = await isTokenApprovedForMarket(account, price, chainId, provider)
        if (!isTokenApproved) {
            isTokenApproved = await approveTokenForMarket(chainId, provider)
        }
        if (isTokenApproved) {
            const tx = await marketContract.buy(id)
            await tx.wait(2)
            return true
        }
        return false          
    } catch (e) {
      console.log(e)
      return false
    }
}






/**
 * Auction Contract Management
 */
export async function createAuction(collection, owner, token_id, startPrice, startTime, endTime, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider);
    const auctionContractInfo = getContractInfo('QubismAuction', chainId);
    if (!auctionContract || !auctionContractInfo) return false
    try {
        let isApproved = await isNFTApprovedForAuction(collection, owner, chainId, provider);
        if(!isApproved) {
            isApproved = await setNFTApprovalForAuction(collection, true, chainId, provider);            
        }
        if (isApproved) {
            const tx =  await auctionContract.createAuction(collection, token_id, ethers.utils.parseEther(startPrice),startTime,endTime);
            const receipt = await tx.wait(2);
            if(receipt.confirmations) {
                return true
            }
        }               
        return false;
    }catch(e) {
        console.log(e);
        return false;
    }
}

export async function finalizeAuction(id, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider)
    if (!auctionContract) return false
    try {
      const tx = await auctionContract.finalizeAuction(id)
      await tx.wait(2)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
}
  
export async function bidOnAuction(account, id, price, chainId, provider) {
    const auctionContract = getContractObj('QubismAuction', chainId, provider)
    const Token = getContractObj('Token', chainId, provider)
    if (!auctionContract || !Token) return false    
    try {
        let isTokenApproved = await isTokenApprovedForAuction(account, price, chainId, provider)
        if (!isTokenApproved) {
            isTokenApproved = await approveTokenForAuction(chainId, provider)
        }
        if (isTokenApproved) {
            const tx = await auctionContract.bidOnAuction(id, ethers.utils.parseEther(price))
            await tx.wait(2)
            return true
        }
        return false          
    } catch (e) {
      console.log(e)
      return false
    }
}