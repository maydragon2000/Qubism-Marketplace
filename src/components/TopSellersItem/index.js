import * as React from 'react';
function TopSellersItem(props){

  const {index, seller} = props;

  function getFormatedString(number) {
    const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let result = `${number}`;
    if (numbersToAddZeroTo.includes(number)) {
      result = `0${number}`;
    } 
    return result;  
  }
 
  return(
    <div className="col-12 col-lg-4 mb-30">
      <div className="creator-sec dd-bg">
        <div className="author-item">
          <div className="author-rank">{getFormatedString(index+1)}</div>
          <div className="author-img">
            <div className="author-img-container" 
              onClick={() => props.history.push(`/profile/${seller.userInfo.address}`)}>
              <img src={seller.userInfo.profilePic} alt="" />
            </div>
            
          </div>
          <div className="author-info">
              <h5 className="author-name">{seller.userInfo.name}</h5>
              <p className="author-earn mb-0">{`${seller.totalSold} ${process.env.REACT_APP_TOKEN}`}</p>
          </div>
        </div>
      </div>
    </div>   
  )
}

export default TopSellersItem



