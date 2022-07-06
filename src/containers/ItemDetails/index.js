import React, {useState,useEffect} from "react";
import {useParams} from "react-router-dom"
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Querystring from 'query-string'
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { format } from "date-fns";

import * as S from "./styles";
import Modal from "react-modal";
import DatePicker from 'react-datepicker'
import { getTokenBalance, listItem, delistItem, buy, createAuction, finalizeAuction, bidOnAuction } from "../../utils/contracts";
import { formatNum } from "../../utils";


import { SlideCountdown } from 'react-fancy-countdown';
import artworkfire from "../../assets/img/art-work/fire.png"

import '../../assets/css/itemDetails.css'
import "react-datepicker/dist/react-datepicker.css";
import coinIcon from "../../assets/img/icons/coin.png";

const ItemDetailsContainer = (props) => {
  const { user, login } = props;    
  const {collection, tokenId} = useParams(); 

  const [item, setItem] = useState(null)
  const { account, active, chainId, library } = useWeb3React();
  const [balance, setBalance] = useState(0)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const [localLikeCount, setLocalLikeCount] = useState(0)
  const [didLike, setDidLike] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)
  const [showEndAuction, setShowEndAuction] = useState(false)
  const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false)
  const [showPutMarketPlace, setShowPutMarketPlace] = useState(false)
  const [auctionStatus, setAuctionStatus] = useState(false)
  const [auctionStatusMessage, setAuctionStatusMessage] = useState('')
  const [state, setState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [bidPrice, setBidPrice] = useState(0)

  const [putType, setPutType] = useState('fixed')
  const [putPrice, setPutPrice] = useState(0)

  const [startType, setStartType] = useState('now')
  const [startDate, setStartDate] = useState(null)
  const [endType, setEndType] = useState('1')
  const [endDate, setEndDate] = useState(null)

  const [listingStatus, setListingStatus] = useState(false);
  const [delistingStatus, setDelistingStatus] = useState(false);
  const [buyingStatus, setBuyingStatus] = useState(false);
  const [creatingAuctionStatus, setCreatingAuctionStatus] = useState(false);
  const [endingAuctionStatus, setEndingAuctionStatus] = useState(false);
  const [biddingStatus, setBiddingStatus] = useState(false);

  useEffect(() => {
    if(!!user) {
      login();
    }
  }, [user, account, library])

  useEffect(() => {
    if(!!account && !!library) {
        getTokenBalance(account, chainId, library.getSigner())
        .then((balance) => {
          setBalance(balance)
        })
        .catch(() => {
          setBalance(0)
        })          
    }
    return () => {
      setBalance(0)          
    }
  }, [account, chainId, library])

  function fetchItem(){
    axios.get(`/api/item/${collection}/${tokenId}`)
    .then(res => {
      setItem(res.data.item)                 
    })
    .catch(err => {
      //show an error page that the item doesnt exist
      setItem(undefined)      
    })
  }
  useEffect(() => {
    if(!item) {
        fetchItem();
    }
  }, [item])

  useEffect(() => {
    if (item){
      setLocalLikeCount(item.likes ? item.likes.length : 0)
      if (user) {
        setDidLike(item.likes && item.likes.includes(user.address.toLowerCase()))
      }          
    }
  }, [item, user])

  useEffect(() => {
    if (item?.auction) setInterval(() => setNewTime(), 1000);
  }, [item]);
  const setNewTime = () => {
    const currentTimestamp = new Date().getTime()
    let countdownDate = 0;
    if(item.auction.startTime * 1000 > currentTimestamp) {
        setAuctionStatus(false)                     
        countdownDate = item.auction.startTime * 1000;
        setAuctionStatusMessage('Auction starts in')   
        
    } else if(item.auction.endTime * 1000 > currentTimestamp) {
        setAuctionStatus(true)
        countdownDate = item.auction.endTime * 1000;
        setAuctionStatusMessage('Ends in')
    } else {
        setAuctionStatusMessage('Auction has ended')
        setAuctionStatus(false)
    }

    if (countdownDate) {
      const distanceToDate = countdownDate - currentTimestamp;

      let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);

      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (numbersToAddZeroTo.includes(days)) {
        days = `0${days}`;
      } 
      if (numbersToAddZeroTo.includes(hours)) {
        hours = `0${hours}`;
      } 
      if (numbersToAddZeroTo.includes(minutes)) {
        minutes = `0${minutes}`;
      } 
      if (numbersToAddZeroTo.includes(seconds)) {
        seconds = `0${seconds}`;
      }    
      setState({ days: days, hours: hours, minutes: minutes, seconds: seconds });
    } else {
        setState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  function clickFavorite() {
    if (user) {
      if (!isLiking){
        setIsLiking(true)
        setLocalLikeCount(l => l + (didLike ? -1 : 1))
        setDidLike(i => !i)
        axios.post("/api/item/like", Querystring.stringify({address: user.address.toLowerCase(), tokenId: item.tokenId, collection: item.itemCollection}))
        .then(res => {
          setIsLiking(false)
        })
        .catch(err => {
          setIsLiking(false)
        })
      }
    }        
  }

  const handleCloseDialog = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  function putOnMarketPlace(){
    if (putType === 'fixed') {
        putFixed()
    } else if (putType === 'timed') {
        putAuction()
    }
  }

  function putFixed(){
    if (putPrice <= 0){
        setSnackBarMessage("Please input price correctly!")
        setOpenSnackbar(true)
        return
    } 
    setListingStatus(true)

    listItem(
        item.itemCollection,
        account,
        item.tokenId,
        putPrice,
        chainId,
        library.getSigner()
    ).then((tokenId) => {
        if (tokenId) {
            axios.get(`/api/sync_block`)
            .then((res) => {
                setListingStatus(false);
                setShowPutMarketPlace(false)
                setSnackBarMessage("Success");
                setOpenSnackbar(true);                    
                props.history.push(`/profile/${account}`)                    
                return true;
            })
            .catch((error) => {
                if (error.response) {
                    setListingStatus(false);
                    setSnackBarMessage(error.response.data.message);
                    setOpenSnackbar(true);                        
                }
            });
        } else {
            setListingStatus(false);
            setSnackBarMessage("Failed Transaction");                
            setOpenSnackbar(true);
        }
    });  
  }    
  function unlistItem() {         
    setDelistingStatus(true)
    delistItem(
      item.pair.id,
      chainId,
      library.getSigner()
    ).then((result) => {
      if (result) {
        axios.get(`/api/sync_block`)
        .then((res) => {
          setDelistingStatus(false);
          setShowUnlistMarketPlace(false)
          setSnackBarMessage("Success");
          setOpenSnackbar(true);                    
          props.history.push(`/profile/${account}`)                    
          return true;
        })
        .catch((error) => {
          if (error.response) {
            setDelistingStatus(false);
            setSnackBarMessage(error.response.data.message);
            setOpenSnackbar(true);                        
          }
        });
      } else {
        setDelistingStatus(false);
        setSnackBarMessage("Failed Transaction");                
        setOpenSnackbar(true);
      }
    });  
  }

  function buyItem() {
    if (balance < item.pair.price){
      setShowBuyNowModal(false)
      setSnackBarMessage("Your available balance is less than the price!")
      setOpenSnackbar(true)            
      return
    } 
    setBuyingStatus(true)

    buy(
      account,
      item.pair.id,
      item.pair.price,
      chainId,
      library.getSigner()
    ).then((tokenId) => {
      if (tokenId) {
        axios.get(`/api/sync_block`)
        .then((res) => {
          setBuyingStatus(false);
          setShowBuyNowModal(false)
          setSnackBarMessage("Success");
          setOpenSnackbar(true);                    
          props.history.push(`/profile/${account}`)                    
          return true;
        })
        .catch((error) => {
          if (error.response) {
            setBuyingStatus(false);
            setSnackBarMessage(error.response.data.message);
            setOpenSnackbar(true);                        
          }
        });
      } else {
        setBuyingStatus(false);
        setSnackBarMessage("Failed Transaction");                
        setOpenSnackbar(true);
      }
    });        
  }


  function putAuction() {
    if (putPrice <= 0){
      setSnackBarMessage("Please input price correctly!")
      setOpenSnackbar(true)
      return
    }
    const currentTime = new Date().getTime()

    let startTimeStamp = 0
    if (startType === 'specific') {
      if (!startDate) {
        setSnackBarMessage("Please select start time.")
        setOpenSnackbar(true)
        return
      }
      const startTime = startDate.getTime()
      if (currentTime >= startTime) {
        setSnackBarMessage("The start time must be after the current time.")
        setOpenSnackbar(true)
        return
      }            
      startTimeStamp = Math.floor(startTime / 1000) 
    } else {
      startTimeStamp = Math.floor(currentTime / 1000)
    }
    console.log("startTimeStamp")
    console.log(startTimeStamp)

    let endTimeStamp = 0        
    if (endType === 'specific') {
      if (!endDate) {
        setSnackBarMessage("Please select end time.")
        setOpenSnackbar(true)
        return
      }
      const endTime = endDate.getTime()
      endTimeStamp = Math.floor(endTime / 1000)
      if (currentTime >= endTime) {
        setSnackBarMessage("The end time must be after the current time.")
        setOpenSnackbar(true)
        return
      }
      if (startTimeStamp >= endTimeStamp) {
        setSnackBarMessage("The end time must be after the start time.")
        setOpenSnackbar(true)
        return
      }            
    } else {
      const later = Number(endType)
      endTimeStamp = startTimeStamp + 86400 * later
    }
    console.log("endTimeStamp")
    console.log(endTimeStamp)
    
    
    setCreatingAuctionStatus(true)
    createAuction(
      item.itemCollection,
      account,
      item.tokenId,
      putPrice,
      startTimeStamp,
      endTimeStamp,
      chainId,
      library.getSigner()
    ).then((tokenId) => {
        if (tokenId) {
          axios.get(`/api/sync_block`)
          .then((res) => {
            setCreatingAuctionStatus(false);
            setShowPutMarketPlace(false)
            setSnackBarMessage("Success");
            setOpenSnackbar(true);                    
            props.history.push(`/profile/${account}`)                    
            return true;
          })
          .catch((error) => {
            if (error.response) {
              setCreatingAuctionStatus(false);
              setSnackBarMessage(error.response.data.message);
              setOpenSnackbar(true);                        
            }
          });
        } else {
          setCreatingAuctionStatus(false);
          setSnackBarMessage("Failed Transaction");                
          setOpenSnackbar(true);
        }
    });        
  }
  function endAuction() {
    setEndingAuctionStatus(true)

    finalizeAuction(
        item.auction.id,
        chainId,
        library.getSigner()
    ).then((result) => {
      if (result) {
        axios.get(`/api/sync_block`)
        .then((res) => {
          setEndingAuctionStatus(false);
          setShowEndAuction(false)
          setSnackBarMessage("Success");
          setOpenSnackbar(true);                    
          props.history.push(`/profile/${account}`)                    
          return true;
        })
        .catch((error) => {
          if (error.response) {
            setEndingAuctionStatus(false);
            setSnackBarMessage(error.response.data.message);
            setOpenSnackbar(true);                        
          }
        });
      } else {
        setEndingAuctionStatus(false);
        setSnackBarMessage("Failed Transaction");                
        setOpenSnackbar(true);
      }
    });
    
  }
  function placeBid() {
          
    if ( !(item?.auction.bids) && (bidPrice - item.auction.price  < 0)) {
      setSnackBarMessage("Your bid must be higher than minimum bid price!")
      setOpenSnackbar(true)            
      return
    }
    
    if ((item?.auction.bids?.length > 0) && (bidPrice - item.auction.price * 1.05  <= 0)){
      setSnackBarMessage("Your bid must be 5% higher than current bid!")
      setOpenSnackbar(true)            
      return
    }   
    
    if (balance - bidPrice < 0 ){              
      setSnackBarMessage("Your available balance is less than the bid price!")
      setOpenSnackbar(true)            
      return
    }


    setBiddingStatus(true)

    bidOnAuction(
      account,
      item.auction.id,
      bidPrice,
      chainId,
      library.getSigner()
    ).then((result) => {
      if (result) {
        axios.get(`/api/sync_block`)
        .then((res) => {
          setBiddingStatus(false);
          closePlaceBidModal()
          setSnackBarMessage("Success");
          setOpenSnackbar(true);                    
          fetchItem()                    
          return true;
        })
        .catch((error) => {
          if (error.response) {
              setBiddingStatus(false);
              setSnackBarMessage(error.response.data.message);
              setOpenSnackbar(true);                        
          }
        });
      } else {
        setBiddingStatus(false);
        setSnackBarMessage("Failed Transaction");                
        setOpenSnackbar(true);
      }
    });       
    
  }
  function closePlaceBidModal(){
    setShowPlaceBidModal(false)
    setBidPrice(0)
  }

  return (
    <>
      <section className="section-padding-100">
          <div className="container">
            <div className="row">

              <div className="col-12 col-lg-5 d-flex detailed-img-container">
                <div className="detailed-img">
                {
                    item?.assetType === 'video' ? <S.NftVideo src={item?.mainData} autoPlay loop controls/> 
                        : item?.assetType === 'image' ? <S.NftImage src={item?.mainData}/>
                            : <><S.NftImage src={item?.coverImage}/><S.NftAudio src={item?.mainData}  autoPlay loop controls/></>              
                }
                </div>
              </div>    

              <div className="col-12 col-lg-7">

                <div className="row">
                  <div className="col-lg-6 mt-s">
                    <div className="sidebar-area">
                      <div className="donnot-miss-widget">
                        <div className="who-we-contant">
                          <div className="filers-list">
                            <div to="/listed" className="filter-item mr-15">
                              {item?.category}
                            </div>
                            <div to="/listed" className="filter-item" onClick={() => clickFavorite()}>
                              {didLike? <S.LoveFillIcon className="mr-5p" size={20}/> : <S.LoveIcon className="mr-5p" size={20}/>}
                              <span className="w-text">{localLikeCount}</span>
                            </div>                             
                          </div>
                          <h4 className="bold">{item?.name}</h4>
                        </div>
                        <div className="mb-15 gray-text">
                          <span className="w-text mr-15">{ item?.price> 0 ? 'Current Price : ' : 'Not for sale' } </span>
                          <span className="bold mr-15">{item?.price> 0 ? `${formatNum(item?.price)} ${process.env.REACT_APP_TOKEN}`:''}</span>
                        </div>
                        
                        <div className="w-text bold description"> {item?.description} </div>
                        
                        <div className="details-list">
                          <p onClick={() => props.history.push(`/profile/${item?.creatorUser.address}`)}>Artist : <span>{item?.creatorUser.name}</span></p>
                          <p>Created : <span>{item?.events ? format(item?.events[item?.events.length-1].timestamp * 1000, "dd MMMM , yyyy") : ''}</span></p>
                          <S.NftAddress
                            href={`${process.env.REACT_APP_BLOCK_EXPLORER}/address/${item?.itemCollection}`}
                            target={"_blank"}>
                              <p>Collection : <span>{item?.collection.name}</span></p>
                          </S.NftAddress>
                          
                        </div>
                        <div className="author-item mb-30" onClick={() => props.history.push(`/profile/${item?.ownerUser.address}`)}>
                          <div className="author-img ml-0">
                            <div className="author-img-container">
                                <img src={item?.ownerUser.profilePic} alt="" />
                            </div>                            
                          </div>
                          <div className="author-info">
                            <div><h5 className="author-name">{item?.ownerUser.name}</h5></div>
                            <p className="author-earn mb-0">Item Owner</p>
                          </div>
                        </div>                 
                        
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6 mt-s">          
                    <h4 className="mb-15">History</h4>
                    {/* If it is not auction then add height-400 to className */}
                    <div className={`highest-bid bid-item ${item?.auction ? 'height-162' : 'height-400'}`}>
                      {item?.events && item?.events.map((event , i) => (
                        <div key={i} className={`author-item mb-15`}>
                            <div className="author-img ml-0">
                              <div className="user-img-container">
                                <img src={((event.name === 'Listed') || (event.name === 'Bid')) ? event.fromUser.profilePic : event.toUser.profilePic} width="40" alt="" />
                              </div>  
                            </div>
                            <div className="author-info">
                                <p>
                                  {event.name} 
                                  {event.name === 'Sold' ? ' to' : ' by'}
                                  <span className="w-text"> {((event.name === 'Listed') || (event.name === 'Bid')) ? event.fromUser.name : event.toUser.name}</span>
                                </p>
                                <p>
                                  {event.price > 0 ? 'Price' : ''}
                                  <span className="w-text mr-15"> {event.price > 0 ? `${formatNum(event.price)} ${process.env.REACT_APP_TOKEN}` : ''}</span>
                                  <span><i className="fa fa-clock-o mr-5p"></i>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</span>
                                </p>
                            </div>
                        </div>
                        ))}              
                    </div>  
                    <h4 className="mb-15 mt-30" style = {{display: item?.auction ? "" : "none"}} >Latest Bids</h4>
                    <div className="highest-bid bid-item height-162" style = {{display: item?.auction ? "" : "none"}} >
                        {item?.auction?.bids && item?.auction?.bids.map((bid , i) => (
                          <div key={i} className={`author-item mb-15`} >
                              <div className="author-img ml-0">
                                <div className="user-img-container">
                                  <img src={bid.fromUser.profilePic} onClick={() => props.history.push(`/profile/${bid.fromUser.address}`)} width="40" alt=""/>
                                </div>                                
                              </div>
                              <div className="author-info">
                                  <p>by<span className="w-text"> {bid.fromUser.name} </span></p>
                                  <p>Bid at<span className="w-text"> {formatNum(bid.bidPrice)} {process.env.REACT_APP_TOKEN}</span></p>
                              </div>
                              <div className="bid-price">
                                  <p>{format(bid.timestamp * 1000, "HH:mm")}</p>
                                  <p><i className="fa fa-clock-o mr-5p"></i>{format(bid.timestamp * 1000, "dd MMMM , yyyy")}</p>
                              </div>
                          </div>
                        ))}
                    </div>      
                  </div>

                </div>

                <div className="row mt-10" style = {{display: item?.auction ? "" : "none"}}>
                  <div className="col-lg-6 mt-s">
                    <div className="highest-bid">
                      <h5 className="w-text mb-15">{item?.auction?.bids?.length > 0 ? 'Highest Bid' : 'Minimum bid'}</h5>
                      <div className="admire">
                        {
                          item?.auction?.bids?.length > 0 &&
                          (
                            <div className="adm w-text" style = {{display: item?.auction?.bids?.length > 0 ? "" : "none"}}>                              
                              <img src={item?.auction?.bids[0]?.fromUser?.profilePic} style={{width:'30px', height:'30px', objectFit:'cover', borderRadius:'30px'}} alt="" className="mr-5p" />
                              {item?.auction?.bids[0]?.fromUser?.name}
                            </div>
                          )
                        }                          
                          <div className="adm"><img src={artworkfire} width="30"  alt="" className="mr-5p" /><span className="bold mr-5p">{item?.price> 0 ? `${formatNum(item?.price)} ${process.env.REACT_APP_TOKEN}`:''}</span></div>
                      </div>
                    </div>
                  </div>
        
                  <div className="col-lg-6">
                    <div className="biding-end">
                      <h4 className="mb-10">{auctionStatusMessage}</h4>
                      <div className="count-down titled circled text-center">
                        {
                          item?.auction && 
                          (<SlideCountdown
                            weeks={false}
                            deadline={auctionStatusMessage === 'Auction starts in' ? format(item?.auction?.startTime * 1000, "yyyy-MM-dd HH:mm:ss") : format(item?.auction?.endTime * 1000, "yyyy-MM-dd HH:mm:ss")} />)
                        }
                      </div>
                    </div>
                  </div>
                </div>                
                  
                {
                  item && props.user ? 
                  <div className="open-popup-link more-btn width-100 mt-30">
                      {item.ownerUser.address.toLowerCase() === props.user.address.toLowerCase() ? 
                          <div style={{cursor:'pointer'}}>
                              <div style = {{display: item?.auction || item?.pair ? "none" : ""}} onClick={() => setShowPutMarketPlace(true)}>Put on marketplace</div>
                              <div style = {{display: item?.auction ? "" : "none"}} onClick={() => setShowEndAuction(true)}>End Auction</div>
                              <div style = {{display: item?.pair ? "" : "none"}} onClick={() => setShowUnlistMarketPlace(true)}>Unlist on marketplace</div>
                          </div> 
                          : 
                          <div style={{cursor:'pointer'}}>
                              <div style = {{display: item?.auction && auctionStatus ? "" : "none"}} onClick={() => setShowPlaceBidModal(true)}>Place a Bid</div>
                              <div style = {{display: item?.pair ? "" : "none"}} onClick={() => setShowBuyNowModal(true)}>Buy Now</div>
                          </div>
                      }
                  </div>  
                  : <></>
                }
                                   
                                  
              </div>
                
            </div>
          </div>
          <Modal
              isOpen={showPlaceBidModal}
              onRequestClose={() => closePlaceBidModal()}
              ariaHideApp={false}
              style={{
                overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
              }}
          >
              <S.ModalBody>
                  <S.ModalHeader>
                      <S.ModalCloseIcon size={32} onClick={() => closePlaceBidModal()}/>
                  </S.ModalHeader>
                  <S.ModalTitle>Your Bid</S.ModalTitle>
                  <S.ModalRow>
                      <S.ModalLabel>Current bid</S.ModalLabel>
                      <S.ModalPrice>{formatNum(item?.auction?.price)} {process.env.REACT_APP_TOKEN}</S.ModalPrice>
                  </S.ModalRow>
                  <S.BidPrice>
                      <S.ModalLabel>Your bid</S.ModalLabel>
                      <S.ModalMainPrice type={"number"} value={bidPrice} onChange={event => setBidPrice(event.target.value)}/>
                      <S.UnitContainer>
                          <S.CoinImage src={coinIcon}/>
                          <S.Unit>{process.env.REACT_APP_TOKEN}</S.Unit>
                      </S.UnitContainer>
                  </S.BidPrice>
                  <S.ModalRow>
                      <S.ModalLabel>Available</S.ModalLabel>
                      <S.ModalPrice>{formatNum(balance)} {process.env.REACT_APP_TOKEN}</S.ModalPrice>
                  </S.ModalRow>
                  <S.ModalAction>
                      <S.ModalButton disabled={biddingStatus} onClick={() => placeBid()}>
                          {
                              biddingStatus? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/>:"Place a Bid"
                          }                            
                      </S.ModalButton>
                  </S.ModalAction>
              </S.ModalBody>
          </Modal>
          <Modal
              isOpen={showBuyNowModal}
              onRequestClose={() => setShowBuyNowModal(false)}
              ariaHideApp={false}
              style={{
                overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
              }}
          >
              <S.ModalBody>
                  <S.ModalHeader>
                      <S.ModalCloseIcon size={32} onClick={() => setShowBuyNowModal(false)}/>
                  </S.ModalHeader>
                  <S.ModalTitle>
                      <S.ModalLabel>You will pay</S.ModalLabel>
                      <S.PayAmount>
                          <S.CoinImage src={coinIcon}/>
                          <S.Price>{formatNum(item?.pair?.price)}</S.Price>
                          <S.Unit>{process.env.REACT_APP_TOKEN}</S.Unit>
                      </S.PayAmount>                   
                  </S.ModalTitle>                    
                  <S.ModalRow> 
                      <S.ModalLabel>Available</S.ModalLabel>
                      <S.ModalPrice>{formatNum(balance)} {process.env.REACT_APP_TOKEN}</S.ModalPrice>
                  </S.ModalRow>
                  <S.ModalActions>
                      <S.ModalCancelButton onClick={() => setShowBuyNowModal(false)}>Cancel</S.ModalCancelButton>
                      <S.ModalSubmitButton disabled={buyingStatus} onClick={() => buyItem()}>
                      {
                          buyingStatus? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Confirm"
                      }                            
                      </S.ModalSubmitButton>
                  </S.ModalActions>
              </S.ModalBody>
          </Modal>
          <Modal
              isOpen={showPutMarketPlace}
              onRequestClose={() => setShowPutMarketPlace(false)}
              ariaHideApp={false}
              style={{
                overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
              }}
          >
              <S.ModalBody>
                  <S.ModalHeader>
                      <S.ModalCloseIcon size={32} onClick={() => setShowPutMarketPlace(false)}/>
                  </S.ModalHeader>
                  <S.ModalTitle>Put on Marketplace</S.ModalTitle>
                  <S.PutTypes>
                      <S.PutType onClick={() => setPutType('fixed') } className={putType === 'fixed'?'active':''}>
                          <S.FixedIcon size={32}/>
                          <S.TypeLabel>Fixed price</S.TypeLabel>
                      </S.PutType>
                      <S.PutType onClick={() => setPutType('timed') } className={putType === 'timed'?'active':''}>
                          <S.TimeIcon size={36}/>
                          <S.TypeLabel>Timed auction</S.TypeLabel>
                      </S.PutType>
                  </S.PutTypes>
                  {
                      putType === 'fixed' &&
                      <S.Field>
                          <S.label>Price</S.label>
                          <S.InputContainer>
                              <S.Input type={"number"} placeholder={"Enter Price"} value={putPrice} onChange={event => setPutPrice(event.target.value)} />
                              <S.InputUnit>{process.env.REACT_APP_TOKEN}</S.InputUnit>
                          </S.InputContainer>
                      </S.Field>
                  }
                  {
                      putType === 'timed' &&
                      <>
                          <S.Field>
                              <S.label>Minimum bid</S.label>
                              <S.InputContainer>
                                  <S.Input type={"number"} placeholder={"Enter minimum bid"} value={putPrice} onChange={event => setPutPrice(event.target.value)}/>
                                  <S.InputUnit>{process.env.REACT_APP_TOKEN}</S.InputUnit>
                              </S.InputContainer>
                          </S.Field>
                          <S.SelectRow>
                              <S.SelectField>
                                  <S.label>Starting Date</S.label>
                                  <S.StartingDateSelect name={"starting_date"} defaultValue={startType} onChange={event => setStartType(event.target.value)}>
                                      <S.OrderByOption value={"now"}>Right after listing</S.OrderByOption>
                                      <S.OrderByOption value={"specific"}>Pick specific date</S.OrderByOption>
                                  </S.StartingDateSelect>
                                  {
                                      startType === "specific" &&
                                      <DatePicker
                                          selected={startDate}
                                          onChange={value => setStartDate(value)}
                                          className={"input-picker"}
                                          showTimeSelect
                                          dateFormat="Pp"                                            
                                      />
                                  }
                              </S.SelectField>
                              <S.SelectField>
                                  <S.label>Expiration Date</S.label>
                                  <S.StartingDateSelect name={"expiration_date"} defaultValue={endType} onChange={event => setEndType(event.target.value)}>
                                      <S.OrderByOption value={"1"}>1 day</S.OrderByOption>
                                      <S.OrderByOption value={"3"}>3 days</S.OrderByOption>
                                      <S.OrderByOption value={"5"}>5 days</S.OrderByOption>
                                      <S.OrderByOption value={"7"}>7 days</S.OrderByOption>
                                      <S.OrderByOption value={"specific"}>Pick specific date</S.OrderByOption>
                                  </S.StartingDateSelect>
                                  {
                                      endType === "specific" &&
                                      <DatePicker
                                          selected={endDate}
                                          onChange={value => setEndDate(value)}
                                          className={"input-picker"}
                                          showTimeSelect
                                          dateFormat="Pp"                                            
                                      />
                                  }
                              </S.SelectField>
                          </S.SelectRow>
                      </>
                  }

                  <S.ModalActions>
                      <S.ModalCancelButton onClick={() => setShowPutMarketPlace(false)}>Cancel</S.ModalCancelButton>
                      <S.ModalSubmitButton onClick={() => putOnMarketPlace()} disabled={listingStatus || creatingAuctionStatus}>
                      {
                          listingStatus || creatingAuctionStatus ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Confirm"
                      }
                      </S.ModalSubmitButton>
                  </S.ModalActions>
              </S.ModalBody>
          </Modal>
          <Modal
              isOpen={showEndAuction}
              onRequestClose={() => setShowEndAuction(false)}
              ariaHideApp={false}
              style={{
                overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
              }}
          >
              <S.ModalBody>
                  <S.ModalHeader>
                      <S.ModalCloseIcon size={32} onClick={() => setShowEndAuction(false)}/>
                  </S.ModalHeader>
                  <S.ModalTitle>
                      End Auction                        
                      <S.PayAmount>
                          <S.Price>Are you sure you want to end this auction ?</S.Price>                            
                      </S.PayAmount>                        
                  </S.ModalTitle>                    
                  <S.ModalActions>
                      <S.ModalCancelButton onClick={() => setShowEndAuction(false)}>Cancel</S.ModalCancelButton>
                      <S.ModalSubmitButton onClick={() => endAuction()} disabled={endingAuctionStatus}>
                      {
                          endingAuctionStatus ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "End Auction"
                      }
                      </S.ModalSubmitButton>
                  </S.ModalActions>
              </S.ModalBody>
          </Modal>
          <Modal
              isOpen={showUnlistMarketPlace}
              onRequestClose={() => setShowUnlistMarketPlace(false)}
              ariaHideApp={false}
              style={{
                overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(60, 67, 53, 0.5)', zIndex: 99, },
                content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '500px', borderRadius: '20px', zIndex: 9999},
              }}
          >
              <S.ModalBody>
                  <S.ModalHeader>
                      <S.ModalCloseIcon size={32} onClick={() => setShowUnlistMarketPlace(false)}/>
                  </S.ModalHeader>
                  <S.ModalTitle>
                      Unlist Item                        
                      <S.PayAmount>
                          <S.Price>Are you sure you want to unlist this auction ?</S.Price>                            
                      </S.PayAmount>                        
                  </S.ModalTitle>                    
                  <S.ModalActions>
                      <S.ModalCancelButton onClick={() => setShowUnlistMarketPlace(false)}>Cancel</S.ModalCancelButton>
                      <S.ModalSubmitButton onClick={() => unlistItem() } disabled={delistingStatus}>
                      {
                          delistingStatus ? <CircularProgress style={{width: "16px", height: "16px", color: "white",}}/> : "Unlist"
                      }
                      </S.ModalSubmitButton>
                  </S.ModalActions>
              </S.ModalBody>
          </Modal>
          <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center'  }}
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseDialog}
              message={snackBarMessage}
              action={
                  <React.Fragment>
                  <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseDialog}>
                      <CloseIcon fontSize="small" />
                  </IconButton>
                  </React.Fragment>
              }
              />
      </section>      
    </>
  );
}

export default ItemDetailsContainer;