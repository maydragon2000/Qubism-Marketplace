import React , {useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import TimerClock from '../../assets/img/icons/timerClock.png';
import { formatNum, shorter } from "../../utils";

function NFTItem(props){
    const {item} = props;
    const [auctionStatus, setAuctionStatus] = useState(false)
    const [auctionStatusMessage, setAuctionStatusMessage] = useState('')
    const [state, setState] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        if (item?.auction) setInterval(() => setNewAuctionTime(), 1000);
    }, [item]);
    const setNewAuctionTime = () => {
        const currentTimestamp = new Date().getTime()
        let countdownDate = 0;
        if(item.auction.startTime * 1000 > currentTimestamp) {
            setAuctionStatusMessage('Auction has not started')
            setAuctionStatus(false)
        } else if(item.auction.endTime * 1000 > currentTimestamp) {
            setAuctionStatus(true)
            countdownDate = item.auction.endTime * 1000;
            setAuctionStatusMessage('Auction is started')
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
    
            setState({ days: days, hours: hours,  minutes: minutes, seconds: seconds });
        }
    };

    useEffect(() => {
        setInterval(() => setNewTime(), 1000);
    }, [item]);
    const setNewTime = () => {
        const currentTimestamp = new Date().getTime()
        const timestamp = item?.timestamp * 1000;        
    
        const distanceToDate = currentTimestamp - timestamp;    
        let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
        if (days > 0) {
            setTimeAgo(`${days} days ago`)
        } else if (hours > 0){
            setTimeAgo(`${hours} hours ago`)
        } else if (minutes > 0){
            setTimeAgo(`${minutes} minutes ago`)
        } else if (seconds > 0){
            setTimeAgo(`${seconds} seconds ago`)
        }       
    };  


  return(
    
    <div className="pricing-item ">
        <div className="wraper">
            <NavLink to={`/itemDetails/${item?.itemCollection}/${item?.tokenId}`}>
                <div className="img-container">
                    <img src={item?.coverImage} alt="" />
                    <div className="timer" style = {{display: item?.auction ? "" : "none"}}>
                        {
                            auctionStatus ?                                             
                                `${state.days || '00'}:${state.hours || '00'}:${state.minutes || '00'}:${state.seconds || '00'}`                    
                                : 
                                `${auctionStatusMessage}`
                        }
                    </div>                
                </div>    
            </NavLink>
            <div className="owner-info">
                <div className="user-img-container">
                    <img src={item?.ownerUser?.profilePic} alt="" />
                </div>                    
                <NavLink to={`/profile/${item?.ownerUser?.address}`}><h3>{shorter(item?.ownerUser?.name)}</h3></NavLink>
            </div>
                        
            <div><h4>{item?.name}</h4></div>
            
            <div className="pricing">
                {item?.price> 0 ? (item?.auction? (item?.auction?.bids?.length > 0 ? 'Highest Bid : ' : 'Minimum bid : ') : 'Current Price : ') :'Not for sale'}
                <span className="ml-15">{item?.price> 0 ? `${formatNum(item?.price)} ${process.env.REACT_APP_TOKEN}`:''}</span> 
            </div> 
            <div className="admire">
                <div className="adm"><i className="fa fa-clock-o"></i> {timeAgo}</div>
                <div className="adm"><i className="fa fa-heart-o"></i>{item?.likes?.length} Like</div>
            </div>
        </div>
    </div>
    
  )
}

export default NFTItem