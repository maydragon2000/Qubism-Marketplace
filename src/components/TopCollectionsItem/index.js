import * as React from 'react';
import { NavLink } from "react-router-dom";

function TopCollectionsItem(props){
  const {collection} = props;

  return(
    <div className="col-12 col-md-6 col-lg-3 mb-15">
        <div className="service_single_content collection-item">
            <div className="img-container">
              <img src={collection.uri} alt="" />
            </div>
            <div className="collection_info ">
                <h6>{collection.name}</h6>
                <p>Owner : <span className="w-text">{collection.ownerUser.name}</span></p>
            </div>
            
        </div>
    </div>
  )
}

export default TopCollectionsItem