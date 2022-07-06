import * as React from 'react';
import { Contract } from '@ethersproject/contracts'
import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import Isotope from 'isotope-layout';
import 'isotope-cells-by-row';


import TokenABI from '../contracts/Token.json'
import QubismNFTABI from '../contracts/QubismNFT.json'
import QubismMarketABI from '../contracts/QubismMarket.json'
import QubismAuctionABI from '../contracts/QubismAuction.json'

function SortingCard() {
      jQueryBridget( 'isotope', Isotope, $ );

      var portfolioIsotope = $('.dream-portfolio').isotope({
        itemSelector: '.single_gallery_item',
        layoutMode: 'fitRows'
      });

      $('.portfolio-menu button').on('click', function() {
        $(".portfolio-menu button").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({
          filter: $(this).data('filter')
        });
      });
}

function Addshrink() {
    let RelBanner = document.querySelector('#banner');

    window.addEventListener("scroll", e => {
        if(window.pageYOffset > 86){
          RelBanner.classList.add("shrink");
        }else
        {
            RelBanner.classList.remove("shrink");
        }
    });
}

function loader() {
    var fadeTarget = document.getElementById("preloader");

    function fadeOutEffect() {
        
        var fadeEffect = setInterval(function () {
            if (fadeTarget.style.opacity > 0) {
                fadeTarget.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
                fadeTarget.style.display = 'none'
            }
        }, 100);
    }

    window.onload = setTimeout(fadeOutEffect , 1000)
}

export {
    SortingCard,
    Addshrink,
    loader
};


export const currentNetwork = process.env.REACT_APP_NETWORK_ID;

export const CONTRACTS_BY_NETWORK = {
  [currentNetwork]: {
    Token: {
      address: '0xFBAad4eFdB7797F45Dac9Cd369B03a90bD731298',
      abi: TokenABI,
    },
    QubismNFT: {
      address: "0x044F2002a466111E233c3c0a6C38604E7e36973E",
      abi: QubismNFTABI,
    },
    QubismMarket: {
      address: "0xa05002fe1452b04cfca23775b63c909a8cb1310f",
      abi: QubismMarketABI
    },
    QubismAuction: {
      address: "0x00552135b815761cde9f5b1b995a69b26cf8a3f3",
      abi: QubismAuctionABI
    }
  },  
}

export function getContractInfo(name, chainId = null) {
  if(!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];  
  if(contracts) {
    return contracts?.[name];
  }else{
    return null;
  }
}

export function getContractObj(name, chainId, provider) {
  const info = getContractInfo(name, chainId);
  return !!info && new Contract(info.address, info.abi, provider);
}

export function getCollectionContract(address, chainId, provider) {
  const info = getContractInfo('QubismNFT', chainId);
  return !!info && new Contract(address, info.abi, provider);
}

export const shorter = (str) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export function formatNum(value) {
  let intValue = Math.floor(value)
  if (intValue < 10) {
    return ''+ parseFloat(value).toFixed(2)
  } else if (intValue < 1000){
    return '' + intValue
  } else if (intValue < 1000000) {
    return parseFloat(intValue/1000).toFixed(1) + 'K'
  } else if (intValue < 1000000000) {
    return parseFloat(intValue/1000000).toFixed(1) + 'M'
  } else {
    return parseFloat(intValue/1000000000).toFixed(1) + 'G'
  }
}

