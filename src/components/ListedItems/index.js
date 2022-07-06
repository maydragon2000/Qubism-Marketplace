import * as React from 'react';
import { NavLink } from "react-router-dom";

import InfoComponent from '../InfoComponent'
import NFTItem from '../NFTItem'

import './listedItems.css'

function ListedItemsContainer(props){
  const {listedItems} = props;

  return(
    <section className="section-padding-100 clearfix">

        <div className="container">
            <InfoComponent
              titleSm='Marketplace Items'
              titleLg='Listed Items'              
            />

            <div className="row align-items-center">
            	{listedItems.map((item , index) => (
                <div className="col-lg-3 col-sm-6 col-xs-12">
                  <NFTItem key={index} {...props} item={item} />                    
                </div>	                
            	))}
                <div className="col-12 col-lg-12 text-center">
                    <NavLink className="btn more-btn" to="/listed">Load More</NavLink>
                </div>
            </div>
            
        </div>
    </section>
  )
}

export default ListedItemsContainer