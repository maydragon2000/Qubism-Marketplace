import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
const HeroContainer = (props) => {
	const { connectAccount } = props;
	const {account, active, chainId, deactivate} = useWeb3React();

	function createNFT(){
        if (!account) {
            connectAccount();
        } else {
            props.history.push(`/createitem`);
        }
    }  

	return(
	    <section className="hero-section moving section-padding" id="home">
	        
	        <div className="hero-section-content">
	            
	            <div className="container ">
	                <div className="row align-items-center">
	                    <div className="col-12 col-lg-6 col-md-12">
	                        <div className="welcome-content">
	                            <div className="promo-section">
	                                <h3 className="special-head gradient-text">All NFTs You need in One Marketplace</h3>
	                            </div>
	                            <h1>The Best Place to Collect , Buy and Sell <span className="gradient-text">Awesome NFTs</span> </h1>
	                            <p className="w-text">Grow your NFT brand with enterprise friendly features, complete customisation, and tons of integrations!</p>
	                            <div className="dream-btn-group">
	                                <button className="btn btn-explore more-btn mr-3" onClick={() => props.history.push(`/explore/`)}>Explore</button>
	                                <button className="btn btn-Collect more-btn" onClick={() => createNFT()}>Create NFT </button>
	                            </div>
	                        </div>
	                    </div>
	                    <div className="col-lg-6"></div>
	                </div>
	            </div>
	        </div>
	    </section>
	)
}

export default HeroContainer