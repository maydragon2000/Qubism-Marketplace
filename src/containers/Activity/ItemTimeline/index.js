import * as React from 'react';
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { formatNum } from "../../../utils";

function ItemTimeline(props){
    const {event} = props;
    return(
        <li>          
            <div className="timelineDot"></div>
            <div className="timelineDate">
                <p><i className="fa fa-calendar mr-5p"></i>{format(event.timestamp * 1000, "MM/dd/yyyy")}</p>
                <p><i className="fa fa-clock-o mr-5p"></i>{format(event.timestamp * 1000, "HH:mm a")}</p>
            </div>
            <div className="timelineWork">
                <h6 className="bold" onClick={() => props.history.push(`/itemDetails/${event.itemInfo?.itemCollection}/${event.itemInfo?.tokenId}`)}>
                    {event.itemInfo.name}
                </h6>                
                <span>
                    <a href={`${process.env.REACT_APP_BLOCK_EXPLORER}/tx/${event.txhash}`} target="_blank" rel="noreferrer">{event.name}</a>
                    { (event.name === 'Listed') && 
                        <>
                         {' by '}<span className="w-text bold" onClick={() => props.history.push(`/profile/${event.fromUser.address}`)}>{event.fromUser.name}</span>
                         {' for '}<span className="w-text bold">{`${formatNum(event.price)} ${process.env.REACT_APP_TOKEN}`}</span>
                        </>
                    }
                    { ((event.name === 'Minted') || (event.name === 'Delisted')) && 
                        <>
                        {' by '}<span className="w-text" onClick={() => props.history.push(`/profile/${event.toUser.address}`)}>{event.toUser.name}</span>
                        </>
                    }
                    { ((event.name === 'Sold') || (event.name === 'Bid')) && 
                        <>
                        {' from '}<span className="w-text" onClick={() => props.history.push(`/profile/${event.fromUser.address}`)}>{event.fromUser.name}</span>
                        {' to '}<span className="w-text" onClick={() => props.history.push(`/profile/${event.toUser.address}`)}>{event.toUser.name}</span>
                        {' for '}<span className="w-text">{`${formatNum(event.price)} ${process.env.REACT_APP_TOKEN}`}</span> 
                        </>
                    }
                </span>
            </div>
        </li>
  )
}

export default ItemTimeline