import * as React from 'react';
import TopSellersItem from '../TopSellersItem'

function TopSellersContainer(props){
	const {sellers} = props;

  return(
	    <section className="about-us-area section-padding-50 clearfix">
	        
	        <div className="container">
	            <div className="row">
				     
	                <div className="col-12 col-lg-12">
	                    <div className="who-we-contant">
	                        <div className="dream-dots text-left">
	                            <span className="gradient-text">Creative Creators</span>
	                        </div>
	                        <h4>Top Sellers in a month</h4>
	                    </div>
	                </div>

	                {sellers.map((seller, index) => (								
						<TopSellersItem style={{display: 'none'}} index={index} {...props} seller={seller} />   									
					))}                

	            </div>
	        </div>
	    </section>
  )
}

export default TopSellersContainer